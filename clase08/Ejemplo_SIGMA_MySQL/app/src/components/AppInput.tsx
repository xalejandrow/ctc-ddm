import { StyleSheet, TextInput, TextInputProps } from 'react-native';
export function AppInput(props: TextInputProps) { return <TextInput {...props} style={styles.input} placeholderTextColor="#7A8B9C" />; }
const styles = StyleSheet.create({ input: { borderWidth: 1, borderColor: '#B8C6D6', borderRadius: 8, backgroundColor: 'white', padding: 12, fontSize: 16, color: '#102A43' } });
