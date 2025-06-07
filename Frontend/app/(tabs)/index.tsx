import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function InicioScreen() {
  const [recetasDestacadas, setRecetasDestacadas] = useState([]);
  const [recetasOrdenadas, setRecetasOrdenadas] = useState([]);
  const [recetasFiltradas, setRecetasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const cargarRecetas = async () => {
    try {
      const recientes = await axios.get('http://192.168.0.232:8081/recetas/recientes');
      const ordenadas = await axios.get('http://192.168.0.232:8081/recetas/ordenadas', {
        params: { criterio: 'alfabetico' }
      });

      setRecetasDestacadas(recientes.data);
      setRecetasOrdenadas(ordenadas.data);
      setRecetasFiltradas([]);
    } catch (error) {
      console.error('Error al cargar recetas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarRecetas();
  }, []);

  const handleRecetaPress = (id) => {
    router.push(`../detalle-receta/${id}`);
  };

  const buscarRecetas = async () => {
    if (!busqueda.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`http://192.168.0.232:8081/recetas/buscar`, {
        params: { nombre: busqueda.trim() }
      });
      setRecetasDestacadas(res.data);
    } catch (error) {
      console.error('Error al buscar recetas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorTipo = async (tipo) => {
    setBusqueda('');
    setLoading(false);
    try {
      const res = await axios.get(`http://192.168.0.232:8081/recetas/tipo/${tipo}`);
      setRecetasFiltradas(res.data);
    } catch (error) {
      console.error('Error al filtrar por tipo:', error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusqueda = async () => {
    setBusqueda('');
    await cargarRecetas();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarRecetas();
  };

  const renderContenido = () => (
    <View>
      <View style={styles.header}>
        <Image source={require('../../assets/icons/logochef.png')} style={styles.logo} />
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar.."
            placeholderTextColor="#aaa"
            style={styles.search}
            value={busqueda}
            onChangeText={setBusqueda}
            onSubmitEditing={buscarRecetas}
          />
          {busqueda !== '' && (
            <TouchableOpacity onPress={limpiarBusqueda} style={styles.clearButton}>
              <Text style={{ color: '#fff', fontSize: 16 }}>✖</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.title}>Recetas recientes</Text>
      <ScrollView horizontal style={styles.carousel} showsHorizontalScrollIndicator={false}>
        {recetasDestacadas.map((receta) => (
          <TouchableOpacity key={receta.id} style={styles.recipeCardContainer} onPress={() => handleRecetaPress(receta.id)}>
            <Image source={{ uri: receta.imagenUrl }} style={styles.recipeCard} />
            <Text style={styles.recipeName}>{receta.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.title}>Recetas ordenadas A-Z</Text>
      <ScrollView horizontal style={styles.carousel} showsHorizontalScrollIndicator={false}>
        {recetasOrdenadas.map((receta) => (
          <TouchableOpacity key={receta.id} style={styles.recipeCardContainer} onPress={() => handleRecetaPress(receta.id)}>
            <Image source={{ uri: receta.imagenUrl }} style={styles.recipeCard} />
            <Text style={styles.recipeName}>{receta.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.title}>Explorar</Text>
      {recetasFiltradas.length > 0 && (
        <>
          <Text style={styles.title}>Recetas tipo: {recetasFiltradas[0]?.tipo}</Text>
          <ScrollView horizontal style={styles.carousel} showsHorizontalScrollIndicator={false}>
            {recetasFiltradas.map((receta) => (
              <TouchableOpacity key={receta.id} style={styles.recipeCardContainer} onPress={() => handleRecetaPress(receta.id)}>
                <Image source={{ uri: receta.imagenUrl }} style={styles.recipeCard} />
                <Text style={styles.recipeName}>{receta.nombre}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      <View style={styles.tagsContainer}>
        {['Principal', 'Merienda', 'Postre', 'Desayuno', 'Entradas'].map((tag) => (
          <TouchableOpacity key={tag} onPress={() => filtrarPorTipo(tag)}>
            <Text style={styles.tag}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#31c48d" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={[]} // dummy data para usar FlatList
      keyExtractor={() => 'key'}
      ListHeaderComponent={renderContenido()}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  search: {
    backgroundColor: '#222',
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
    tintColor: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  carousel: {
    flexDirection: 'row',
  },
  recipeCardContainer: {
    marginRight: 10,
    alignItems: 'center',
    width: 160,
  },
  recipeCard: {
    width: 160,
    height: 120,
    borderRadius: 10,
  },
  recipeName: {
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
    fontSize: 14,
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
    marginRight: 10,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 8,
    padding: 4,
    zIndex: 1,
  },
});
