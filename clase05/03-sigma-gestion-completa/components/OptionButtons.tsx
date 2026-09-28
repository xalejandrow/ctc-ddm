import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { label: string; options: string[]; value: string; onChange: (value: any) => void };
export function OptionButtons({ label, options, value, onChange }: Props) {
  return <View style={styles.container}><Text style={styles.label}>{label}</Text><View style={styles.options}>
    {options.map((option) => <Pressable key={option} onPress={() => onChange(option)} style={[styles.option, value === option && styles.selected]}><Text style={[styles.optionText, value === option && styles.selectedText]}>{option}</Text></Pressable>)}
  </View></View>;
}
const styles = StyleSheet.create({
  container: { marginBottom: 16 }, label: { color: '#102A43', fontWeight: '700', marginBottom: 8 }, options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { borderWidth: 1, borderColor: '#BCCCDC', paddingVertical: 9, paddingHorizontal: 11, borderRadius: 8 }, selected: { backgroundColor: '#1877B9', borderColor: '#1877B9' },
  optionText: { color: '#52606D', fontSize: 13 }, selectedText: { color: '#FFFFFF', fontWeight: '700' },
});
