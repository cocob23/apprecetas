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
              Authorization: 'Client-ID a8d51cbeb3fa1b9'
            }
          }
        );
        imagenUrl = imgurRes.data.data.link;
      }

      const res = await axios.post(
        `http://192.168.0.232:8081/recetas/subir`,
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

      const nuevaId = res.data?.id;

      Alert.alert("Receta creada exitosamente");
      router.replace('/(tabs)/recetas');

      if (nuevaId) {
        router.push(`/editar-pasos/${nuevaId}`);
      }
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

          <Text style={styles.subTitle}>Nombre</Text>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

          <Text style={styles.subTitle}>Descripción</Text>
          <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} multiline />

          <Text style={styles.subTitle}>Porciones</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={porciones} onChangeText={setPorciones} />

          <Text style={styles.subTitle}>Tipo</Text>
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
  subTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'left'
  },
});
