import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Image, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function IngredientesScreen() {
  const [ingredientes, setIngredientes] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [modoFiltro, setModoFiltro] = useState<'con' | 'sin'>('con');
  const router = useRouter();

  useEffect(() => {
    axios
      .get('http://192.168.0.232:8081/ingredientes')
      .then(res => setIngredientes(res.data))
      .catch(err => console.error('Error al cargar ingredientes', err));
  }, []);

  const toggleIngrediente = (id) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const buscar = async (modo) => {
    if (seleccionados.length === 0) return;
    setModoFiltro(modo === 'contienen' ? 'con' : 'sin');
    setLoading(true);
    try {
      const res = await axios.get(`http://192.168.0.232:8081/recetas/${modo}`, {
        params: { ids: seleccionados.join(',') }
      });
      setRecetas(res.data);
    } catch (error) {
      console.error('Error al buscar recetas:', error);
    } finally {
      setLoading(false);
    }
  };

  const ingredientesFiltrados = ingredientes.filter(i =>
    i.nombre.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtrar por ingredientes</Text>

      <TextInput
        placeholder="Buscar ingrediente..."
        placeholderTextColor="#aaa"
        style={styles.input}
        value={filtroTexto}
        onChangeText={setFiltroTexto}
      />

      {seleccionados.length > 0 && (
        <ScrollView horizontal style={styles.seleccionadosContainer} showsHorizontalScrollIndicator={false}>
          {ingredientes
            .filter(i => seleccionados.includes(i.id))
            .map(i => (
              <View
                key={i.id}
                style={[
                  styles.seleccionadoChip,
                  modoFiltro === 'sin' ? styles.chipSelectedRed : styles.chipSelectedGreen
                ]}
              >
                <Text style={styles.seleccionadoTexto}>{i.nombre}</Text>
                <TouchableOpacity onPress={() => toggleIngrediente(i.id)}>
                  <Text style={styles.seleccionadoCerrar}>✖</Text>
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
      )}

      <ScrollView horizontal style={styles.chipsContainer} showsHorizontalScrollIndicator={false}>
        {ingredientesFiltrados.length > 0 ? (
          ingredientesFiltrados.map(ing => (
            <TouchableOpacity
              key={ing.id}
              onPress={() => toggleIngrediente(ing.id)}
              style={[
                styles.chip,
                seleccionados.includes(ing.id) &&
                  (modoFiltro === 'sin' ? styles.chipSelectedRed : styles.chipSelectedGreen)
              ]}
            >
              <Text style={{ color: '#fff' }}>{ing.nombre}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: '#aaa', marginTop: 10 }}>No se encontraron ingredientes</Text>
        )}
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.filtrarBtn} onPress={() => buscar('contienen')}>
          <Text style={styles.filtrarTxt}>✅ Con estos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filtrarBtn, { backgroundColor: '#666' }]} onPress={() => buscar('no-contienen')}>
          <Text style={styles.filtrarTxt}>🚫 Sin estos</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sub}>Recetas encontradas:</Text>

      {loading ? (
        <ActivityIndicator color="#31c48d" size="large" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView horizontal style={styles.resultadoContainer} showsHorizontalScrollIndicator={false}>
          {recetas.map((receta) => (
            <TouchableOpacity
              key={receta.id}
              style={styles.recipeCardContainer}
              onPress={() => router.push(`/detalle-receta/${receta.id}`)}
            >
              <Image source={{ uri: receta.imagenUrl }} style={styles.recipeCard} />
              <Text style={styles.recipeName}>{receta.nombre}</Text>
            </TouchableOpacity>
          ))}
          {recetas.length === 0 && (
            <Text style={{ color: '#aaa', marginTop: 20, textAlign: 'center' }}>
              No hay recetas para esta combinación.
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
    paddingTop: 80,
  
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 10,
    borderRadius: 20,
    marginBottom: 30,
    height: 40,
  },
  seleccionadosContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    maxHeight: 44,
    paddingVertical: 0,
  },
  seleccionadoChip: {
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    height: 40,
  },
  seleccionadoTexto: {
    color: '#fff',
    marginRight: 5,
  },
  seleccionadoCerrar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chipsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    maxHeight: 44,
    paddingVertical: 0,
  },
  chip: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelectedGreen: {
    backgroundColor: '#31c48d',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelectedRed: {
    backgroundColor: '#e53935',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  filtrarBtn: {
    flex: 1,
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  filtrarTxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sub: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 10,
  },
  resultadoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  recipeCardContainer: {
    marginRight: 10,
    alignItems: 'center',
    width: 160,
  },
  recipeCard: {
    width: 160,
    height: 120,
    borderRadius: 10,
  },
  recipeName: {
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
});
