import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { loginUsuario } from '../../services/api';
import { AuthContext } from '../AuthContext';

export default function PerfilScreen() {
  const { usuario, login, logout, setUsuario } = useContext(AuthContext);
  const [mail, setMail] = useState('');
  const [clave, setClave] = useState('');

  const mostrarToast = (mensaje) => {
    Toast.show({
      type: 'success',
      text1: mensaje,
      visibilityTime: 2000,
      position: 'top',
      topOffset: 70,
    });
  };

  const handleLogin = async () => {
    try {
      const data = await loginUsuario(mail, clave);
      await login(data);
      mostrarToast(`Hola ${data.alias}`);
    } catch (error) {
      mostrarToast(error.message || 'Error al iniciar sesión');
    }
  };

  const subirFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (!result.canceled) {
      try {
        const imagen = result.assets[0];

        const res = await axios.post('https://api.imgur.com/3/image', {
          image: imagen.base64,
          type: 'base64',
        }, {
          headers: {
            Authorization: 'Client-ID 5b70aab1b41270b'
          }
        });

        const url = res.data.data.link;

        await axios.put(`http://192.168.0.6:8081/usuarios/${usuario.id}/foto`, null, {
          params: { url }
        });

        const resUser = await axios.get(`http://192.168.0.6:8081/usuarios/${usuario.id}`);
        setUsuario(resUser.data);

        mostrarToast("¡Foto actualizada!");
      } catch (err) {
        console.error(err);
        mostrarToast("Error al subir la foto");
      }
    }
  };

  if (!usuario) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bannerContainer}>
          <View style={styles.bannerPlaceholder} />
          <View style={styles.logoOverlay}>
            <Image source={require('../../assets/icons/logochef.png')} style={styles.logoIcon} />
            <Text style={styles.logoText}>CocinApp</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Inicio de sesión</Text>
          <Text style={styles.subtitle}>
            Iniciá sesión con tu cuenta de <Text style={styles.bold}>Recetas</Text>.
          </Text>

          <Text style={styles.label}>Email</Text>
          <LinearGradient colors={['#8e2de2', '#31c48d']} style={styles.inputBorder}>
            <TextInput
              value={mail}
              onChangeText={setMail}
              placeholder="example@email.com"
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </LinearGradient>

          <Text style={styles.label}>Contraseña</Text>
          <LinearGradient colors={['#8e2de2', '#31c48d']} style={styles.inputBorder}>
            <TextInput
              value={clave}
              onChangeText={setClave}
              placeholder="Introduzca su contraseña"
              style={styles.input}
              secureTextEntry
              placeholderTextColor="#aaa"
            />
          </LinearGradient>

          <TouchableOpacity onPress={() => router.push('/recuperar/solicitar')}>
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin}>
            <LinearGradient colors={['#8e2de2', '#31c48d']} style={styles.button}>
              <Text style={styles.buttonText}>Inicia sesión</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Toast />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Mi información</Text>
        <View style={styles.profileBox}>
          <Image
            source={usuario.fotoPerfil ? { uri: usuario.fotoPerfil } : require('../../assets/icons/logochef.png')}
            style={styles.avatar}
          />
          <TouchableOpacity onPress={subirFoto}>
            <Text style={styles.fotoLink}>Cambiar foto</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Alias</Text>
          <Text style={styles.text}>{usuario.alias}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.text}>{usuario.mail}</Text>

          <TouchableOpacity onPress={() => router.push('/recuperar/solicitar')} style={{ marginTop: 20 }}>
            <LinearGradient colors={['#8e2de2', '#31c48d']} style={styles.button}>
              <Text style={styles.buttonText}>Recuperar clave</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  bannerContainer: { position: 'relative' },
  bannerPlaceholder: { width: '100%', height: 210 },
  logoOverlay: { position: 'absolute', top: 60, alignSelf: 'center', alignItems: 'center' },
  logoIcon: { width: 100, height: 100, marginBottom: 10 },
  logoText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 20 },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  subtitle: { color: '#ccc', marginBottom: 10 },
  bold: { fontWeight: 'bold', color: '#fff' },
  label: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 10, marginBottom: 10 },
  link: { color: '#aaa', marginTop: 10, marginBottom: 20 },
  button: {
    padding: 9,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    height: 45,
    width: 200,
    justifyContent: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  invited: { textAlign: 'center', marginTop: 25, color: '#fff', textDecorationLine: 'underline' },
  profileBox: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20
  },
  text: { color: '#ccc', fontSize: 16 },
  avatar: { width: 150, height: 150, borderRadius: 100, marginBottom: 20 },
  logoutButton: {
    backgroundColor: '#e53935',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
    marginBottom: 10,
    width: 200
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  inputBorder: {
    borderRadius: 30,
    padding: 2,
    marginBottom: 12,
  },
  input: {
    borderRadius: 28,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#111',
    color: '#fff',
    width: 300,
  },
  bottom: {
    marginTop: 'auto',
    marginBottom: 50,
    alignItems: 'center'
  },
  fotoLink: {
    color: '#31c48d',
    marginTop: 10,
    textDecorationLine: 'underline'
  }
});
