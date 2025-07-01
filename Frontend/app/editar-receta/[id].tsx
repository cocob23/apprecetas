import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { AuthContext } from '../AuthContext';

export default function EditarRecetaScreen() {
  const { id } = useLocalSearchParams();
  const recetaId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
  const { usuario } = useContext(AuthContext);
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [porciones, setPorciones] = useState('');
  const [tipo, setTipo] = useState('Principal');

  const pickerRef = useRef(); // 👈 para controlar apertura en iOS

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await axios.get(`https://apprecetas-production.up.railway.app/recetas/${recetaId}`);
        const receta = res.data;
        setNombre(receta.nombre);
        setDescripcion(receta.descripcion);
        setPorciones(receta.porciones.toString());
        setTipo(receta.tipo);
      } catch (err) {
        console.error('Error al cargar receta:', err);
      }
    };

    cargarDatos();
  }, [recetaId]);

  const guardarCambios = async () => {
    try {
      await axios.put(`https://apprecetas-production.up.railway.app/recetas/editar/${recetaId}`, {
        nombre,
        descripcion,
        porciones: parseInt(porciones),
        tipo
      }, {
        params: { usuarioId: usuario.id }
      });

      Alert.alert("Éxito", "Receta actualizada correctamente");
      router.push('/(tabs)/recetas');
    } catch (err) {
      console.error('Error al actualizar:', err);
      Alert.alert("Error", "No se pudo actualizar la receta");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Receta</Text>

      <Text style={styles.subTitle}>Nombre</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text style={styles.subTitle}>Descripción</Text>
      <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} multiline />

      <Text style={styles.subTitle}>Porciones</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={porciones} onChangeText={setPorciones} />

      <Text style={styles.subTitle}>Tipo</Text>
<View style={styles.pickerWrapper}>
  <RNPickerSelect
    onValueChange={(value) => setTipo(value)}
    value={tipo}
    useNativeAndroidPickerStyle={false}
    placeholder={{ label: 'Seleccioná un tipo', value: null }}
    items={[
      { label: 'Principal', value: 'Principal' },
      { label: 'Merienda', value: 'Merienda' },
      { label: 'Postre', value: 'Postre' },
      { label: 'Desayuno', value: 'Desayuno' },
      { label: 'Entradas', value: 'Entradas' },
    ]}
    style={{
      inputIOS: styles.fakeInput,
      inputAndroid: styles.fakeInput,
      placeholder: {
        color: '#aaa',
      },
      iconContainer: {
        top: 18,
        right: 10,
      },
    }}
    Icon={() => <Text style={styles.icon}>▼</Text>}
  />
</View>

      <TouchableOpacity onPress={() => router.push(`/editar-pasos/${recetaId}`)}>
        <Text style={{ color: '#31c48d' }}>✏️ Editar pasos</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push(`/editar-ingredientes/${recetaId}`)}>
        <Text style={{ color: '#31c48d', marginTop: 10 }}>✏️ Editar ingredientes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={guardarCambios}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', marginTop: 40 },
  input: { backgroundColor: '#222', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: '#31c48d', padding: 12, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  subTitle: { color: '#fff', fontSize: 18, marginBottom: 5, textAlign: 'left' },
pickerWrapper: {
  marginBottom: 10,
},
fakeInput: {
  backgroundColor: '#222',
  borderRadius: 8,
  height: 40,
  paddingHorizontal: 15,
  color: '#fff',
  fontSize: 14,
  justifyContent: 'center',
  textAlignVertical: 'center'
},
inputText: {
  color: '#fff',
  fontSize: 14,
  flex: 1,
},
icon: {
  color: '#fff',
  fontSize: 16,
  position: 'absolute',
  right: 15,
  marginTop: -7,
  top: '50%',
},

});
