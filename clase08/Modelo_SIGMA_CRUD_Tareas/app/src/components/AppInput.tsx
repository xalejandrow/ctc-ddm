import { StyleSheet, TextInput, TextInputProps } from "react-native";
export function AppInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.multiline && styles.area]}
      placeholderTextColor="#6B7E90"
    />
  );
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    borderColor: "#C7D3DF",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#102A43",
  },
  area: { minHeight: 90, textAlignVertical: "top" },
});
