import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function NuevaClaveScreen() {
  const { mail } = useLocalSearchParams();
  const [clave1, setClave1] = useState('');
  const [clave2, setClave2] = useState('');

  const mostrarToast = (mensaje, tipo = 'success') => {
    Toast.show({
      type: tipo,
      text1: mensaje,
      visibilityTime: 2000,
      position: 'top',
      topOffset: 70,
    });
  };

  const handleCambiarClave = async () => {
    if (clave1 !== clave2) {
      mostrarToast('Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      await axios.post('http://192.168.0.232:8081/usuarios/cambiar-clave', null, {
        params: { mail, nuevaClave: clave1 },
      });
      mostrarToast('Tu contraseña fue actualizada');
      router.push('/perfil');
    } catch (error) {
      mostrarToast('No se pudo cambiar la contraseña', 'error');
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
        <Text style={styles.title}>Nueva contraseña</Text>

        <Text style={styles.label}>Ingresá nueva clave</Text>
        <TextInput
          value={clave1}
          onChangeText={setClave1}
          placeholder="Nueva clave"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Repetí la clave</Text>
        <TextInput
          value={clave2}
          onChangeText={setClave2}
          placeholder="Reingresá clave"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleCambiarClave}>
          <LinearGradient colors={['#6b21a8', '#31c48d']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Cambiar clave</Text>
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
  title: { fontSize: 30, color: '#fff', fontWeight: 'bold', marginTop: 20 },
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
