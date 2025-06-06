import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditarPasosScreen() {
  const { id } = useLocalSearchParams();
  const recetaId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
  const router = useRouter();

  const [pasos, setPasos] = useState([]);

  const ordenarPorNumero = (arr) =>
    [...arr].sort((a, b) => Number(a.numero) - Number(b.numero));

  const cargarPasos = async () => {
    try {
      const res = await axios.get(`http://192.168.0.232:8081/pasos/por-receta?recetaId=${recetaId}`);
      const pasosConLocalId = res.data.map(p => ({
        ...p,
        localId: p.id.toString()
      }));
      setPasos(ordenarPorNumero(pasosConLocalId));
    } catch (err) {
      console.error('Error al cargar pasos:', err);
      Alert.alert("Error", "No se pudieron cargar los pasos");
    }
  };

  useEffect(() => {
    if (recetaId) cargarPasos();
  }, [recetaId]);

  const guardarCambiosPaso = async (id, paso) => {
    if (!paso.descripcion.trim()) {
      Alert.alert("Error", "La descripción del paso no puede estar vacía");
      return;
    }

    const cantidadConMismoNumero = pasos.filter(p => p.numero === paso.numero && p.localId !== paso.localId).length;
    if (cantidadConMismoNumero > 0) {
      Alert.alert("Error", `Ya existe otro paso con el número ${paso.numero}`);
      return;
    }

    try {
      if (!id) {
        await axios.post("http://192.168.0.232:8081/pasos/agregar", {
          recetaId,
          numero: paso.numero,
          descripcion: paso.descripcion,
          imagenUrl: paso.imagenUrl,
          videoUrl: paso.videoUrl,
        });
      } else {
        await axios.put(`http://192.168.0.232:8081/pasos/${id}/editar`, paso);
      }

      Alert.alert("Paso guardado correctamente");
      cargarPasos();
    } catch (err) {
      console.error('Error al guardar paso:', err);
      Alert.alert("Error al guardar el paso");
    }
  };

  const eliminarPaso = async (id) => {
    try {
      if (!id) {
        setPasos(prev => ordenarPorNumero(prev.filter(p => p.id !== null)));
        return;
      }
      await axios.delete(`http://192.168.0.232:8081/pasos/${id}/eliminar`);
      Alert.alert("Paso eliminado");
      cargarPasos();
    } catch (err) {
      console.error('Error al eliminar paso:', err);
      Alert.alert("Error al eliminar el paso");
    }
  };

const agregarPaso = () => {
  const numerosExistentes = pasos.map(p => Number(p.numero)).sort((a, b) => a - b);

  let nuevoNumero = 1;
  for (let i = 1; i <= numerosExistentes.length + 1; i++) {
    if (!numerosExistentes.includes(i)) {
      nuevoNumero = i;
      break;
    }
  }

  const nuevoPaso = {
    id: null,
    recetaId,
    numero: nuevoNumero,
    descripcion: '',
    imagenUrl: '',
    videoUrl: '',
    localId: `nuevo-${Date.now()}`
  };

  setPasos(prev => ordenarPorNumero([...prev, nuevoPaso]));
};

  const actualizarPaso = (localId, campo, valor) => {
    setPasos(prev =>
      ordenarPorNumero(
        prev.map(p => (p.localId === localId ? { ...p, [campo]: valor } : p))
      )
    );
  };

  const renderPaso = ({ item }) => (
    <View style={styles.pasoBox}>
      <Text style={styles.numero}>Paso {item.numero}</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        multiline
        value={item.descripcion}
        onChangeText={text => actualizarPaso(item.localId, 'descripcion', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Imagen URL"
        value={item.imagenUrl || ''}
        onChangeText={text => actualizarPaso(item.localId, 'imagenUrl', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Video URL"
        value={item.videoUrl || ''}
        onChangeText={text => actualizarPaso(item.localId, 'videoUrl', text)}
      />
      <View style={styles.botones}>
        <TouchableOpacity onPress={() => guardarCambiosPaso(item.id, item)}>
          <Text style={styles.guardar}>💾 Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => eliminarPaso(item.id)}>
          <Text style={styles.eliminar}>🗑️ Borrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Pasos</Text>
      {pasos.length > 0 ? (
        <FlatList
          data={pasos}
          keyExtractor={(item) => item.localId}
          renderItem={renderPaso}
        />
      ) : (
        <Text style={styles.noPasos}>No hay pasos para esta receta</Text>
      )}
      <TouchableOpacity style={styles.agregarBtn} onPress={agregarPaso}>
        <Text style={styles.agregarTxt}>+ Agregar paso</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.finalizarBtn} onPress={() => router.back()}>
        <Text style={styles.finalizarTxt}>Volver</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.finalizarBtn}
        onPress={() => router.push(`/editar-ingredientes/${recetaId}`)}
      >
        <Text style={styles.finalizarTxt}>Continuar con ingredientes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  pasoBox: { backgroundColor: '#222', padding: 15, marginBottom: 15, borderRadius: 10 },
  numero: { color: '#fff', fontSize: 16, marginBottom: 5, fontWeight: 'bold' },
  input: { backgroundColor: '#333', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 },
  botones: { flexDirection: 'row', justifyContent: 'space-between' },
  guardar: { color: '#31c48d', fontWeight: 'bold' },
  eliminar: { color: 'red', fontWeight: 'bold' },
  finalizarBtn: {
    backgroundColor: '#31c48d',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  finalizarTxt: { color: '#fff', fontWeight: 'bold' },
  noPasos: { color: '#ccc', textAlign: 'center', marginTop: 40 },
  agregarBtn: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  agregarTxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
