import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type Props = TextInputProps & { label: string; error?: string };

export function Field({ label, error, multiline, ...props }: Props) {
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={[styles.input, multiline && styles.multiline, error && styles.errorInput]} placeholderTextColor="#7B8794" multiline={multiline} textAlignVertical={multiline ? 'top' : 'center'} {...props} />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  field: { marginBottom: 16 }, label: { color: '#102A43', fontSize: 15, fontWeight: '700', marginBottom: 7 },
  input: { borderWidth: 1, borderColor: '#BCCCDC', borderRadius: 9, minHeight: 48, paddingHorizontal: 12, fontSize: 16, color: '#102A43' },
  multiline: { minHeight: 108, paddingTop: 12 }, errorInput: { borderColor: '#C63B3B', borderWidth: 2 }, error: { color: '#C63B3B', marginTop: 5, fontSize: 13 },
});
