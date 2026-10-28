import { Pressable, StyleSheet, Text } from "react-native";
type Props = {
  title: string;
  onPress: () => void;
  color?: "primary" | "danger" | "secondary";
  disabled?: boolean;
};
export function AppButton({
  title,
  onPress,
  color = "primary",
  disabled,
}: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, styles[color], disabled && styles.disabled]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  primary: { backgroundColor: "#0F8B8D" },
  danger: { backgroundColor: "#B42318" },
  secondary: { backgroundColor: "#52667A" },
  disabled: { opacity: 0.5 },
  text: { color: "white", fontWeight: "700" },
});
