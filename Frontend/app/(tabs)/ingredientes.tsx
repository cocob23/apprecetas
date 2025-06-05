import { StyleSheet, Text, View } from 'react-native';

export default function IngredientesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ingredientes (en construcción)</Text>
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
