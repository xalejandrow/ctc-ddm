import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function FormInput({ label, error, multiline, ...inputProps }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline, Boolean(error) && styles.inputError]}
        placeholderTextColor="#7B8794"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 18 },
  label: { color: '#102A43', fontWeight: '700', marginBottom: 7, fontSize: 15 },
  input: { borderWidth: 1, borderColor: '#BCCCDC', borderRadius: 9, minHeight: 48, paddingHorizontal: 12, fontSize: 16, color: '#102A43' },
  multiline: { minHeight: 112, paddingTop: 12 },
  inputError: { borderColor: '#C63B3B', borderWidth: 2 },
  error: { color: '#C63B3B', marginTop: 6, fontSize: 13, lineHeight: 18 },
});
