import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginUsuario } from '../../services/api';
import { AuthContext } from '../AuthContext';


export default function PerfilScreen() {
  const { usuario, login, logout } = useContext(AuthContext);
  const [mail, setMail] = useState('');
  const [clave, setClave] = useState('');

  const handleLogin = async () => {
    try {
      const data = await loginUsuario(mail, clave);
      await login(data);
      Alert.alert('Bienvenido', `Hola ${data.alias}`);
    } catch (error: any) {
      alert(error.message || 'Error al iniciar sesión');
    }
  };

  if (!usuario) {
    return (
      <View style={styles.container}>
        <View style={styles.bannerContainer}>
          <View style={styles.bannerPlaceholder}/>
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
<LinearGradient
  colors={['#8e2de2', '#31c48d']} 
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.inputBorder}
>
  <TextInput
    value={mail}
    onChangeText={setMail}
    placeholder="example@email.com"
    style={styles.input}
    placeholderTextColor="#aaa"
  />
</LinearGradient>

  <Text style={styles.label}>Contraseña</Text>

<LinearGradient
  colors={['#8e2de2', '#31c48d']} 
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.inputBorder}
>
          
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
              <LinearGradient
                colors={['#8e2de2', '#31c48d']} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Inicia sesión</Text>
              </LinearGradient>
            </TouchableOpacity>

          <Text style={styles.invited}>Ingresar como invitado</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi información</Text>
      <View style={styles.profileBox}>
        <Image source={require('../../assets/icons/logochef.png')} style={styles.avatar} />
        <Text style={styles.label}>Alias</Text>
        <Text style={styles.text}>{usuario.alias}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.text}>{usuario.mail}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 20 },
  bannerContainer: { position: 'relative' },
  banner: { width: '100%', height: 250 },
  logoOverlay: { position: 'absolute', top: 60, alignSelf: 'center', alignItems: 'center' },
  logoIcon: { width: 100, height: 100, marginBottom: 10 },
  logoText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 20 },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', marginBottom: 30, marginTop: 50, textAlign: 'center' },
  subtitle: { color: '#ccc', marginBottom: 10 },
  bold: { fontWeight: 'bold', color: '#fff' },
  label: { fontSize: 20, fontWeight: 'bold', color: '#aaa', marginTop: 10, marginBottom: 10 },
  
  link: { color: '#aaa', marginTop: 10, marginBottom: 20 },
  button: { backgroundColor: '#31c48d', padding: 9, borderRadius: 30, alignItems: 'center', marginTop: 10, height: 45, width: 200,
  justifyContent: 'center' },
  buttonText: { color: '#', fontWeight: 'bold', fontSize: 20, textAlign: 'center', textAlignVertical: 'center' },
  invited: { textAlign: 'center', marginTop: 25, color: '#fff', textDecorationLine: 'underline' },
  profileBox: { alignItems: 'center', backgroundColor: '#1a1a1a', padding: 20, borderRadius: 10 },
  text: { color: '#ccc', fontSize: 16 },
  avatar: { width: 100, height: 100, borderRadius: 15, marginBottom: 20 },
  logoutButton: { marginTop: 400, backgroundColor: '#e53935', padding: 15, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  bannerPlaceholder: {width: '100%', height: 210},

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
});
