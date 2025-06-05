import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function InicioScreen() {
  const [recetasDestacadas, setRecetasDestacadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get('http://192.168.0.232:8081/recetas/recientes')
      .then((response) => setRecetasDestacadas(response.data))
      .catch((error) => console.error('Error al traer recetas:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleRecetaPress = (id) => {
    router.push(`../detalle-receta/${id}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
        <ActivityIndicator size="large" color="#31c48d" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/icons/logochef.png')} style={styles.logo} />
        <TextInput placeholder="Buscar.." placeholderTextColor="#aaa" style={styles.search} />
        <Image source={require('../../assets/icons/bell.png')} style={styles.icon} />
        <Image source={require('../../assets/icons/menu.png')} style={styles.icon} />
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

      <Text style={styles.title}>Explorar</Text>
      <View style={styles.tagsContainer}>
        {[
          'Principal', 'Merienda', 'Postre', 'Desayuno', 'Entradas'
        ].map((tag) => (
          <Text style={styles.tag} key={tag}>{tag}</Text>
        ))}
      </View>
    </ScrollView>
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
    marginVertical: 15,
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
});
