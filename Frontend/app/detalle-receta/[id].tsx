import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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

  const cargarDatos = async () => {
    try {
      const recetaRes = await axios.get(`http://192.168.0.232:8081/recetas/${recetaId}`);
      const likesRes = await axios.get(`http://192.168.0.232:8081/recetas/${recetaId}/likes`);
      const comentariosRes = await axios.get(`http://192.168.0.232:8081/comentarios/aprobados?recetaId=${recetaId}`);
      const puntuacionRes = await axios.get(`http://192.168.0.232:8081/puntuaciones/promedio?recetaId=${recetaId}`);
      const pasosRes = await axios.get(`http://192.168.0.232:8081/pasos/por-receta?recetaId=${recetaId}`);

      let miPuntaje = 0;
      try {
        const yaPuntuoRes = await axios.get(`http://192.168.0.232:8081/puntuaciones/usuario`, {
          params: { usuarioId: usuario.id, recetaId }
        });
        if (yaPuntuoRes.data !== null) {
          miPuntaje = yaPuntuoRes.data;
        }
      } catch (err) {
        miPuntaje = 0;
      }

      const likeExiste = await axios.get(`http://192.168.0.232:8081/recetas/${recetaId}/liked`, {
        params: { usuarioId: usuario.id }
      });

      setReceta(recetaRes.data);
      setLikes(likesRes.data);
      setComentarios(comentariosRes.data);
      setPromedioPuntuacion(puntuacionRes.data);
      setMiPuntuacion(miPuntaje);
      setPasos(pasosRes.data);
      setMeGusta(likeExiste.data);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const manejarLike = async () => {
    try {
      if (meGusta) {
        await axios.delete(`http://192.168.0.232:8081/recetas/${recetaId}/dislike`, {
          params: { usuarioId: usuario.id }
        });
      } else {
        await axios.post(`http://192.168.0.232:8081/recetas/${recetaId}/like`, null, {
          params: { usuarioId: usuario.id }
        });
      }
      await cargarDatos();
    } catch (error) {
      console.error('Error al manejar like:', error);
    }
  };

  const manejarPuntuacion = async (valor) => {
    try {
      await axios.post(`http://192.168.0.232:8081/puntuaciones/guardar`, null, {
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
    if (!nuevoComentario.trim()) return;
    try {
      await axios.post(`http://192.168.0.232:8081/comentarios/agregar`, {
        recetaId,
        usuarioId: usuario.id,
        comentario: nuevoComentario
      });
      setNuevoComentario('');
      await cargarDatos();
    } catch (error) {
      console.error('Error al comentar:', error);
    }
  };

  const eliminarComentario = async (comentarioId) => {
    Alert.alert(
      'Eliminar comentario',
      '¿Estás seguro que querés eliminar este comentario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.0.232:8081/comentarios/${comentarioId}/eliminar`);
              cargarDatos();
            } catch (error) {
              console.error('Error al eliminar comentario:', error);
            }
          }
        }
      ]
    );
  };

  if (loading || !receta) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#31c48d" /></View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: receta.imagenUrl }} style={styles.image} />
      <Text style={styles.title}>{receta.nombre}</Text>
      <Text style={styles.subtitle}>Por: {receta.usuario?.alias || 'Desconocido'}</Text>
      <Text style={styles.text}>{receta.descripcion}</Text>
      <Text style={styles.text}>Tipo: {receta.tipo} | Porciones: {receta.porciones}</Text>
      <Text style={styles.text}>⭐ Promedio: {promedioPuntuacion.toFixed(1)} / 5</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <TouchableWithoutFeedback onPress={manejarLike}>
          <FontAwesome
            name="heart"
            size={24}
            color={meGusta ? 'red' : 'gray'}
            style={{ marginRight: 10 }}
          />
        </TouchableWithoutFeedback>
        <Text style={{ color: '#fff' }}>{likes}</Text>

        <View style={{ flexDirection: 'row', marginLeft: 20 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => manejarPuntuacion(star)}>
              <FontAwesome
                name={star <= miPuntuacion ? 'star' : 'star-o'}
                size={24}
                color="#ffd700"
                style={{ marginHorizontal: 2 }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Pasos</Text>
      {pasos.map((paso, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Paso {paso.numero}:</Text>
          <Text style={{ color: '#eee' }}>{paso.descripcion}</Text>
          {paso.imagenUrl && (
            <Image source={{ uri: paso.imagenUrl }} style={{ height: 150, borderRadius: 8, marginTop: 5 }} />
          )}
          {paso.videoUrl && (
            <Text style={{ color: '#4cc9f0', marginTop: 5 }}>🎥 Video: {paso.videoUrl}</Text>
          )}
        </View>
      ))}

      <Text style={styles.sectionTitle}>Comentarios</Text>
      <View style={styles.commentsBox}>
        <ScrollView nestedScrollEnabled>
          {comentarios.map((com, index) => (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.comment}>
                • <Text style={styles.alias}>{com.aliasUsuario}:</Text> {com.comentario}
              </Text>
              {com.usuarioId === usuario.id && (
                <TouchableOpacity onPress={() => eliminarComentario(com.id)}>
                  <Text style={{ color: 'red', marginLeft: 8 }}>🗑️</Text>
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
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#111', flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 200, borderRadius: 10 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  subtitle: { color: '#ccc', fontSize: 16, marginBottom: 10 },
  text: { color: '#eee', marginVertical: 5 },
  likes: { color: '#fff', marginTop: 10 },
  likeButton: { backgroundColor: '#333', padding: 10, borderRadius: 10, marginTop: 5, alignItems: 'center' },
  likeText: { color: '#fff' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  commentsBox: { maxHeight: 200, marginVertical: 10 },
  comment: { color: '#ccc', marginTop: 5, flex: 1 },
  alias: { fontWeight: 'bold', color: '#fff' },
  commentInput: { backgroundColor: '#222', color: '#fff', padding: 10, borderRadius: 10, marginTop: 10 },
  commentButton: { backgroundColor: '#31c48d', padding: 10, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  commentButtonText: { color: '#fff', fontWeight: 'bold' },
});
