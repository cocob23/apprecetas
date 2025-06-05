import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SolicitarRecuperoScreen() {
  const [mail, setMail] = useState('');

  const handleEnviarCodigo = async () => {
    try {
      await axios.post('http://192.168.0.232:8081/usuarios/recuperar', null, {
        params: { mail },
      });
      router.push({ pathname: '/recuperar/verificar', params: { mail } });
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el código');
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
        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.subtitle}>Te enviaremos un código al mail para restablecer tu contraseña.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={mail}
          onChangeText={setMail}
          placeholder="example@email.com"
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleEnviarCodigo}>
          <LinearGradient colors={['#6b21a8', '#31c48d']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Enviar código</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
