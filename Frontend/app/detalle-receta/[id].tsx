import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../AuthContext';

export default function DetalleRecetaScreen() {
  const { id } = useLocalSearchParams();
  const recetaId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
  const { usuario } = useContext(AuthContext);

  const [receta, setReceta] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [likes, setLikes] = useState(0);
  const [meGusta, setMeGusta] = useState(false);
  const [promedioPuntuacion, setPromedioPuntuacion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [miPuntuacion, setMiPuntuacion] = useState(0);
  const [pasos, setPasos] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [refrescando, setRefrescando] = useState(false);

  const mostrarToast = (mensaje) => {
    Toast.show({
      type: 'success',
      text1: mensaje,
      visibilityTime: 2000,
      position: 'top',
      topOffset: 70,
    });
  };

  const cargarDatos = async () => {
    try {
      const [recetaRes, likesRes, comentariosRes, puntuacionRes, pasosRes, ingredientesRes] = await Promise.all([
        axios.get(`https://apprecetas-production.up.railway.app/recetas/${recetaId}`),
        axios.get(`https://apprecetas-production.up.railway.app/recetas/${recetaId}/likes`),
        axios.get(`https://apprecetas-production.up.railway.app/comentarios/aprobados?recetaId=${recetaId}`),
        axios.get(`https://apprecetas-production.up.railway.app/puntuaciones/promedio?recetaId=${recetaId}`),
        axios.get(`https://apprecetas-production.up.railway.app/pasos/por-receta?recetaId=${recetaId}`),
        axios.get(`https://apprecetas-production.up.railway.app/recetas/${recetaId}/ingredientes`)
      ]);

      let miPuntaje = 0;
      let likeExiste = false;

      if (usuario) {
        try {
          const yaPuntuoRes = await axios.get(`https://apprecetas-production.up.railway.app/puntuaciones/usuario`, {
            params: { usuarioId: usuario.id, recetaId }
          });
          if (yaPuntuoRes.data !== null) miPuntaje = yaPuntuoRes.data;

          const likeRes = await axios.get(`https://apprecetas-production.up.railway.app/recetas/${recetaId}/liked`, {
            params: { usuarioId: usuario.id }
          });
          likeExiste = likeRes.data;
        } catch {}
      }

      setReceta(recetaRes.data);
      setLikes(likesRes.data);
      setComentarios(comentariosRes.data);
      setPromedioPuntuacion(puntuacionRes.data);
      setMiPuntuacion(miPuntaje);
      setPasos(pasosRes.data);
      setMeGusta(likeExiste);
      setIngredientes(ingredientesRes.data);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      mostrarToast("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefrescando(true);
    await cargarDatos();
    setRefrescando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const manejarLike = async () => {
    if (!usuario) return mostrarToast("Iniciá sesión para dar like");
    try {
      if (meGusta) {
        await axios.delete(`https://apprecetas-production.up.railway.app/recetas/${recetaId}/dislike`, {
          params: { usuarioId: usuario.id }
        });
      } else {
        await axios.post(`https://apprecetas-production.up.railway.app/recetas/${recetaId}/like`, null, {
          params: { usuarioId: usuario.id }
        });
      }
      await cargarDatos();
    } catch (error) {
      console.error('Error al manejar like:', error);
    }
  };

  const manejarPuntuacion = async (valor) => {
    if (!usuario) return mostrarToast("Iniciá sesión para puntuar");
    try {
      await axios.post(`https://apprecetas-production.up.railway.app/puntuaciones/guardar`, null, {
        params: {
          usuarioId: usuario.id,
          recetaId,
          puntuacion: valor
        }
      });
      await cargarDatos();
    } catch (error) {
      console.error('Error al guardar puntuación:', error);
    }
  };

  const manejarComentario = async () => {
    if (!usuario) return mostrarToast("Iniciá sesión para comentar");
    if (!nuevoComentario.trim()) return;

    try {
      await axios.post(`https://apprecetas-production.up.railway.app/comentarios/agregar`, {
        recetaId,
        usuarioId: usuario.id,
        comentario: nuevoComentario
      });
      setNuevoComentario('');
      await cargarDatos();
      mostrarToast("Comentario enviado");
    } catch (error) {
      console.error('Error al comentar:', error);
    }
  };

  const eliminarComentario = async (comentarioId) => {
    try {
      await axios.delete(`https://apprecetas-production.up.railway.app/comentarios/${comentarioId}/eliminar`);
      mostrarToast("Comentario eliminado");
      await cargarDatos();
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  if (loading || !receta) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#31c48d" /></View>;
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={onRefresh}
            colors={['#31c48d']}
            tintColor="#31c48d"
          />
        }
      >
        <Text style={styles.title}>{receta.nombre}</Text>
        <Image source={{ uri: receta.imagenUrl }} style={styles.image} />
        <Text style={styles.subtitle}>Por: {receta.usuario?.alias || 'Desconocido'}</Text>
        <Text style={styles.text}>{receta.descripcion}</Text>
        <Text style={styles.text}>Tipo: {receta.tipo} | Porciones: {receta.porciones}</Text>
        <Text style={styles.text}>⭐ Promedio: {promedioPuntuacion.toFixed(1)} / 5</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <TouchableWithoutFeedback onPress={manejarLike}>
            <FontAwesome name="heart" size={24} color={meGusta ? 'red' : 'gray'} style={{ marginRight: 10 }} />
          </TouchableWithoutFeedback>
          <Text style={{ color: '#fff' }}>{likes}</Text>

          <View style={{ flexDirection: 'row', marginLeft: 20 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => manejarPuntuacion(star)}>
                <FontAwesome name={star <= miPuntuacion ? 'star' : 'star-o'} size={24} color="#ffd700" style={{ marginHorizontal: 2 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ingredientes</Text>
        {ingredientes.map((ing, index) => (
          <Text key={index} style={{ color: '#eee', marginBottom: 4 }}>
            • {ing.nombre} ({ing.cantidad})
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Pasos</Text>
        {pasos.map((paso, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Paso {paso.numero}:</Text>
            <Text style={{ color: '#eee' }}>{paso.descripcion}</Text>
            {paso.imagenUrl && (
              <Image source={{ uri: paso.imagenUrl + `?t=${Date.now()}` }} style={{ height: 150, borderRadius: 8, marginTop: 5 }} />
            )}
            {paso.videoUrl && (
              <Text style={{ color: '#4cc9f0', marginTop: 5 }}>🎥 Video: {paso.videoUrl}</Text>
            )}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Comentarios</Text>
        <View style={styles.commentsContainer}>
          <ScrollView nestedScrollEnabled>
            {comentarios.map((com, index) => (
              <View key={index} style={styles.commentRow}>
                <Text style={styles.comment}>
                  • <Text style={styles.alias}>{com.aliasUsuario}:</Text> {com.comentario}
                </Text>
                {usuario && com.usuarioId === usuario.id && (
                  <TouchableOpacity onPress={() => eliminarComentario(com.id)}>
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        <TextInput
          style={styles.commentInput}
          placeholder="Agregá un comentario"
          placeholderTextColor="#aaa"
          value={nuevoComentario}
          onChangeText={setNuevoComentario}
        />
        <TouchableOpacity style={styles.commentButton} onPress={manejarComentario}>
          <Text style={styles.commentButtonText}>Comentar</Text>
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#111', flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 200, borderRadius: 10 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 15 },
  subtitle: { color: '#ccc', fontSize: 16, marginBottom: 10 },
  text: { color: '#eee', marginVertical: 5 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  comment: { color: '#ccc', marginTop: 5, flex: 1 },
  alias: { fontWeight: 'bold', color: '#fff' },
  commentInput: { backgroundColor: '#222', color: '#fff', padding: 10, borderRadius: 10, marginTop: 10 },
  commentButton: { backgroundColor: '#31c48d', padding: 10, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  commentButtonText: { color: '#fff', fontWeight: 'bold' },
  commentsContainer: {
    backgroundColor: '#1a1a1a',
    height: 200,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  commentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  deleteIcon: {
    color: 'red',
    marginLeft: 8,
    fontSize: 16,
  },
});
