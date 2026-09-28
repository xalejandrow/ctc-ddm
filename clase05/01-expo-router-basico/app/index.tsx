import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function InicioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejemplo básico de Expo Router</Text>
      <Text style={styles.text}>Esta es la ruta inicial: app/index.tsx</Text>
      <Button
        title="Ir a la segunda pantalla"
        onPress={() => router.push('/segunda')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  text: { fontSize: 16, color: '#52606D' },
});
