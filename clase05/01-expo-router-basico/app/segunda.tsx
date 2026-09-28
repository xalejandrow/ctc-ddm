import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function SegundaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Segunda pantalla</Text>
      <Text style={styles.text}>
        router.push agrega una ruta al historial. router.back vuelve a la anterior.
      </Text>
      <Button title="Volver" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  text: { fontSize: 16, color: '#52606D', lineHeight: 24 },
});
