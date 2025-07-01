import axios from 'axios';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../AuthContext';

export default function RecetasScreen() {
  const { usuario } = useContext(AuthContext);
  const [recetas, setRecetas] = useState([]);
  const router = useRouter();

  const cargarRecetas = async () => {
    try {
      if (!usuario) return;
      const res = await axios.get("http://192.168.0.6:8081/recetas/mias", {
        params: { usuarioId: usuario.id }
      });
      setRecetas(res.data);
    } catch (error) {
      console.error('Error al cargar recetas del usuario:', error);
    }
  };

  const eliminarReceta = (id: number) => {
    Alert.alert(
      "Eliminar receta",
      "¿Estás seguro de que querés eliminar esta receta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.0.6:8081/recetas/${id}/eliminar`);
              cargarRecetas();
            } catch (error) {
              console.error("Error al eliminar la receta:", error);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (usuario?.id) {
      cargarRecetas();
    } else {
      setRecetas([]); // Limpia recetas si se desloguea
    }
  }, [usuario]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mis recetas</Text>

      {usuario ? (
        <>
          {recetas.length > 0 ? (
            <FlatList
              contentContainerStyle={{ paddingBottom: 100 }}
              data={recetas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.recetaBox}>
                  <TouchableOpacity onPress={() => router.push(`/detalle-receta/${item.id}`)}>
                    <Image source={{ uri: item.imagenUrl }} style={styles.imagen} />
                  </TouchableOpacity>
                  <View style={styles.tituloYBoton}>
                    <Text style={styles.recetaNombre}>{item.nombre}</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TouchableOpacity onPress={() => router.push(`/editar-receta/${item.id}`)}>
                        <Text style={styles.editarTexto}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => eliminarReceta(item.id)}>
                        <Text style={styles.eliminarTexto}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              ListFooterComponent={
                <TouchableOpacity style={styles.agregarBtn} onPress={() => router.push('/nueva-receta')}>
                  <Text style={styles.agregarTxt}>➕ Añadir receta</Text>
                </TouchableOpacity>
              }
            />
          ) : (
            <View style={{ alignItems: 'center', marginTop: 30 }}>
              <Text style={{ color: '#ccc' }}>Aún no cargaste recetas.</Text>
              <TouchableOpacity style={styles.agregarBtn} onPress={() => router.push('/nueva-receta')}>
                <Text style={styles.agregarTxt}>➕ Añadir receta</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Text style={{ color: '#ccc', fontSize: 16 }}>Iniciá sesión para ver tus recetas.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 40
  },
  recetaBox: {
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  imagen: {
    width: '100%',
    height: 200,
  },
  tituloYBoton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  recetaNombre: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eliminarTexto: {
    color: 'red',
    fontSize: 18,
  },
  editarTexto: {
    color: '#31c48d',
    fontSize: 18,
  },
  agregarBtn: {
    backgroundColor: '#31c48d',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  agregarTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
