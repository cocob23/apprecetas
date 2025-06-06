import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default function AutoresScreen() {
  const [autores, setAutores] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('');
  const router = useRouter();

  useEffect(() => {
    axios
      .get('http://192.168.0.232:8081/usuarios/todos')
      .then((res) => setAutores(res.data))
      .catch((err) => console.error('Error al cargar autores:', err));
  }, []);

  const cargarRecetasDelAutor = async (usuarioId) => {
    setLoading(true);
    try {
      const res = await axios.get('http://192.168.0.232:8081/recetas/mias', {
        params: { usuarioId },
      });
      setRecetas(res.data);
    } catch (err) {
      console.error('Error al obtener recetas del autor:', err);
    } finally {
      setLoading(false);
    }
  };

  const autoresFiltrados = autores.filter((a) =>
    a.alias.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Autores disponibles</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar autor..."
        placeholderTextColor="#aaa"
        value={filtro}
        onChangeText={setFiltro}
      />

      <ScrollView horizontal style={styles.autoresContainer} showsHorizontalScrollIndicator={false}>
        {autoresFiltrados.map((autor) => (
          <TouchableOpacity
            key={autor.id}
            style={styles.autorChip}
            onPress={() => cargarRecetasDelAutor(autor.id)}
          >
            <Text style={styles.autorText}>{autor.alias}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.title}>Recetas del autor</Text>
      {loading ? (
        <ActivityIndicator color="#31c48d" size="large" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView horizontal style={styles.carousel} showsHorizontalScrollIndicator={false}>
          {recetas.map((receta) => (
            <TouchableOpacity
              key={receta.id}
              style={styles.recipeCardContainer}
              onPress={() => router.push(`/detalle-receta/${receta.id}`)}
            >
              <Image source={{ uri: receta.imagenUrl }} style={styles.recipeCard} />
              <Text style={styles.recipeName}>{receta.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 30,
  },
  autoresContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  autorChip: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  autorText: {
    color: '#fff',
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
});
