import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function InicioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SIGMA</Text>
      <Text style={styles.title}>Sistema Inteligente de Gestión de Mantenimiento</Text>
      <Text style={styles.description}>
        En esta práctica se navega por órdenes de trabajo y se registra un reporte validado.
      </Text>
      <Pressable style={styles.button} onPress={() => router.push('/tareas')}>
        <Text style={styles.buttonText}>Ver tareas pendientes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F5F8FA' },
  logo: { fontSize: 18, fontWeight: '800', color: '#1877B9', letterSpacing: 2 },
  title: { fontSize: 28, fontWeight: '700', color: '#102A43', marginTop: 8 },
  description: { fontSize: 16, lineHeight: 24, color: '#52606D', marginTop: 16, marginBottom: 28 },
  button: { backgroundColor: '#1877B9', padding: 16, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
