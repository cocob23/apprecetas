import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function VerificarCodigoScreen() {
  const [codigo, setCodigo] = useState('');
  const router = useRouter();
  const { mail } = useLocalSearchParams();

  const mostrarToast = (mensaje, tipo = 'success') => {
    Toast.show({
      type: tipo,
      text1: mensaje,
      visibilityTime: 2000,
      position: 'top',
      topOffset: 70,
    });
  };

  const handleVerificar = async () => {
    try {
      await axios.post('https://apprecetas-production.up.railway.app/usuarios/verificar', null, {
        params: { mail, codigo }
      });
      mostrarToast('Código válido');
      router.push({ pathname: '/recuperar/nueva-clave', params: { mail } });
    } catch (err) {
      mostrarToast('Código incorrecto o expirado', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoOverlay}>
          <Image source={require('@/assets/icons/logochef.png')} style={styles.logoIcon} />
          <Text style={styles.logoText}>CocinApp</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Ingresá el código</Text>
        <Text style={styles.subtitle}>Revisá tu correo y escribí el código de 6 dígitos</Text>

        <Text style={styles.label}>Código</Text>
        <TextInput
          value={codigo}
          onChangeText={setCodigo}
          placeholder="Ej: 123456"
          keyboardType="numeric"
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleVerificar}>
          <LinearGradient colors={['#6b21a8', '#31c48d']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Verificar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  header: { height: 200, justifyContent: 'center', alignItems: 'center' },
  logoOverlay: { alignItems: 'center', marginTop: 60 },
  logoIcon: { width: 100, height: 100, marginBottom: 10 },
  logoText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 30, alignItems: 'center' },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', marginTop: 20 },
  subtitle: { color: '#ccc', textAlign: 'center', marginVertical: 10 },
  label: { alignSelf: 'flex-start', marginTop: 20, color: '#ccc', fontSize: 16 },
  input: {
    borderColor: '#31c48d',
    borderWidth: 2,
    width: '100%',
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 15,
    color: '#fff',
    marginTop: 5,
  },
  button: { marginTop: 30, width: '100%' },
  gradientButton: {
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});
