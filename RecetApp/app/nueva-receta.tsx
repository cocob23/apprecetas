import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { AuthContext } from './AuthContext';

export default function NuevaRecetaScreen() {
  const { usuario } = useContext(AuthContext);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [porciones, setPorciones] = useState('');
  const [tipo, setTipo] = useState('Principal');
  const [imagenBase64, setImagenBase64] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(false);
  const [recetaId, setRecetaId] = useState(null);
  const router = useRouter();

  const seleccionarImagen = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImagenBase64(result.assets[0].base64);
        setImagenSeleccionada(true);
        Alert.alert("Imagen seleccionada");
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
    }
  };

  const crearReceta = async () => {
    try {
      let imagenUrl = '';
      if (imagenBase64) {
        const imgurRes = await axios.post(
          'https://api.imgur.com/3/image',
          {
            image: imagenBase64,
            type: 'base64'
          },
          {
            headers: {
              Authorization: 'Client-ID 5b70aab1b41270b'
            }
          }
        );
        imagenUrl = imgurRes.data.data.link;
      }

      const res = await axios.post(
        `https://apprecetas-production.up.railway.app/recetas/subir`,
        {
          nombre,
          descripcion,
          porciones: parseInt(porciones),
          tipo,
          imagenUrl,
        },
        {
          params: { usuarioId: usuario.id }
        }
      );

      const nuevaId = res.data.id;
      setRecetaId(nuevaId);

      Alert.alert("Receta creada exitosamente");
      router.replace(`/editar-pasos/${nuevaId}`);
    } catch (error) {
      console.error("Error al crear receta:", error);
      Alert.alert("Error al crear receta");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.text}>Nueva Receta</Text>
          <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#888" value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="Descripción" placeholderTextColor="#888" value={descripcion} onChangeText={setDescripcion} />
          <TextInput style={styles.input} placeholder="Porciones" placeholderTextColor="#888" keyboardType="numeric" value={porciones} onChangeText={setPorciones} />

          <Text style={styles.label}>Tipo</Text>
          <View style={styles.input}>
            <RNPickerSelect
              placeholder={{ label: 'Seleccioná un tipo', value: null }}
              onValueChange={(value) => setTipo(value)}
              value={tipo}
              items={[
                { label: 'Principal', value: 'Principal' },
                { label: 'Merienda', value: 'Merienda' },
                { label: 'Postre', value: 'Postre' },
                { label: 'Desayuno', value: 'Desayuno' },
                { label: 'Entradas', value: 'Entradas' },
              ]}
              useNativeAndroidPickerStyle={false}
              style={{
                inputIOS: {
                  color: '#fff',
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  height: 15
                },
                inputAndroid: {
                  color: '#fff',
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  height: 15
                },
                iconContainer: {
                  top: 5,
                  right: 10,
                },
              }}
              Icon={() => <Text style={{ color: '#fff' }}>▼</Text>}
            />
          </View>

          <TouchableOpacity style={styles.botonSecundario} onPress={seleccionarImagen}>
            <Text style={styles.botonSecundarioTexto}>
              {imagenSeleccionada ? '📷 Cambiar imagen' : '📷 Seleccionar imagen'}
            </Text>
          </TouchableOpacity>

          {recetaId && (
            <>
            <TouchableOpacity onPress={() => router.push(`/editar-pasos/${recetaId}`)}>
              <Text style={{ color: '#31c48d', marginTop: 10 }}>✏️ Editar pasos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push(`/editar-ingredientes/${recetaId}`)}>
                <Text style={{ color: '#31c48d', marginTop: 10 }}>🧂 Editar ingredientes</Text>
            </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.agregarBtn} onPress={crearReceta}>
            <Text style={styles.agregarTxt}>✅ Crear receta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
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
  botonSecundario: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  botonSecundarioTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold'
  },
});
