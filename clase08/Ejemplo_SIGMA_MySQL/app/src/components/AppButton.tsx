import { Pressable, StyleSheet, Text } from 'react-native';

type Props = { title: string; onPress: () => void; variant?: 'primary' | 'danger'; disabled?: boolean };

export function AppButton({ title, onPress, variant = 'primary', disabled }: Props) {
  return <Pressable disabled={disabled} onPress={onPress} style={[styles.button, variant === 'danger' && styles.danger, disabled && styles.disabled]}><Text style={styles.text}>{title}</Text></Pressable>;
}
const styles = StyleSheet.create({ button: { padding: 14, borderRadius: 8, backgroundColor: '#0F8B8D', alignItems: 'center' }, danger: { backgroundColor: '#B42318' }, disabled: { opacity: 0.55 }, text: { color: 'white', fontWeight: '700', fontSize: 16 } });
