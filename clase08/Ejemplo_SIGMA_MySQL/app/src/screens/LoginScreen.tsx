import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('tecnico@sigma.test');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try { await login(email, password); }
    catch (error) { Alert.alert('No se pudo iniciar sesión', error instanceof Error ? error.message : 'Error desconocido.'); }
    finally { setLoading(false); }
  }

  return <SafeAreaView style={styles.container}><View style={styles.card}><Text style={styles.title}>SIGMA</Text><Text style={styles.subtitle}>Inicio de sesión</Text><Text style={styles.help}>Prueba con tecnico@sigma.test o supervisor@sigma.test. Contraseña: 123456</Text><AppInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Correo" /><AppInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Contraseña" /><AppButton title={loading ? 'Ingresando...' : 'Ingresar'} onPress={handleLogin} disabled={loading} /></View></SafeAreaView>;
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F6F9FC' }, card: { gap: 14 }, title: { fontSize: 34, fontWeight: '700', color: '#102A43' }, subtitle: { fontSize: 22, color: '#0F8B8D', fontWeight: '700' }, help: { color: '#52667A', lineHeight: 20, marginBottom: 4 } });
