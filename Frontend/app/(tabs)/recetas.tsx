import { StyleSheet, Text, View } from 'react-native';

export default function RecetasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mis recetas (en construcción)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});
