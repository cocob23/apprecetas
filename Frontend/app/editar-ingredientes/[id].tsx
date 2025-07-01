import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
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

export default function EditarIngredientesScreen() {
  const { id } = useLocalSearchParams();
  const recetaId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
  const router = useRouter();

  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]);
  const [ingredienteNombre, setIngredienteNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [ingredientesAgregados, setIngredientesAgregados] = useState([]);

  useEffect(() => {
    const cargarIngredientes = async () => {
      try {
        const res = await axios.get('http://192.168.0.6:8081/ingredientes');
        setIngredientesDisponibles(res.data);
      } catch (error) {
        console.error('Error al cargar ingredientes:', error);
        Alert.alert('Error al cargar ingredientes');
      }
    };

    cargarIngredientes();
  }, []);

  useEffect(() => {
    const coincidencias = ingredientesDisponibles.filter(ing =>
      ing.nombre.toLowerCase().includes(ingredienteNombre.toLowerCase())
    );
    setSugerencias(coincidencias);
  }, [ingredienteNombre]);

  const seleccionarIngrediente = (nombre) => {
    setIngredienteNombre(nombre);
    setSugerencias([]);
  };

const agregarIngrediente = async () => {
  try {
    if (!ingredienteNombre.trim()) {
      Alert.alert('Falta el nombre del ingrediente');
      return;
    }

    if (!cantidad.trim()) {
      Alert.alert('Falta la cantidad');
      return;
    }

    // 1. Buscar si ya existe
    let encontrado = ingredientesDisponibles.find(
      ing => ing.nombre.toLowerCase() === ingredienteNombre.trim().toLowerCase()
    );

    // 2. Si no existe, lo agregás a la base
    if (!encontrado) {
      const resNuevo = await axios.post('http://192.168.0.6:8081/ingredientes/crear', {
        nombre: ingredienteNombre.trim()
      });
      encontrado = resNuevo.data;
      // Opcional: actualizá la lista local
      setIngredientesDisponibles(prev => [...prev, encontrado]);
    }

    // 3. Agregás el ingrediente a la receta
    await axios.post('http://192.168.0.6:8081/recetas/agregar-ingrediente', {
      recetaId,
      ingredienteId: encontrado.id,
      cantidad
    });

    setIngredientesAgregados([...ingredientesAgregados, { nombre: encontrado.nombre, cantidad }]);
    Alert.alert('Ingrediente añadido');
    setIngredienteNombre('');
    setCantidad('');
    setSugerencias([]);
  } catch (error) {
    console.error('Error al agregar ingrediente:', error);
    Alert.alert('Error al agregar ingrediente');
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.text}>🧂 Añadir Ingredientes</Text>

          <TextInput
            style={styles.input}
            placeholder="Ingrediente (ej: Sal)"
            placeholderTextColor="#888"
            value={ingredienteNombre}
            onChangeText={setIngredienteNombre}
          />

          {sugerencias.length > 0 && (
            <FlatList
              data={sugerencias}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => seleccionarIngrediente(item.nombre)}>
                  <Text style={styles.sugerencia}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
              style={styles.listaSugerencias}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Cantidad (ej: 2 cucharadas)"
            placeholderTextColor="#888"
            value={cantidad}
            onChangeText={setCantidad}
          />

          <TouchableOpacity style={styles.agregarBtn} onPress={agregarIngrediente}>
            <Text style={styles.agregarTxt}>✅ Añadir ingrediente</Text>
          </TouchableOpacity>

          {ingredientesAgregados.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.text, { fontSize: 16 }]}>📋 Ingredientes agregados:</Text>
              {ingredientesAgregados.map((ing, index) => (
                <Text key={index} style={{ color: '#fff' }}>- {ing.nombre} ({ing.cantidad})</Text>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.agregarBtn, { backgroundColor: '#444' }]}
            onPress={() => router.push('/(tabs)/recetas')}
          >
            <Text style={styles.agregarTxt}>✅ Finalizar receta</Text>
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
  sugerencia: {
    padding: 10,
    backgroundColor: '#333',
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#444'
  },
  listaSugerencias: {
    maxHeight: 150,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden'
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
  }
});
