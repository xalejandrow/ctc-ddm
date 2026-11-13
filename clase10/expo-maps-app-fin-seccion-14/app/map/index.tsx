import { View, Text, StyleSheet } from 'react-native';
const MapScreen = () => {
  return (
    <View style={styles.safeArea}>
      <Text style={[styles.content, styles.title]}>Map Screen</Text>
    </View>
  );
};
export default MapScreen;


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 150 },
  title: { color: '#0f172a', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#475569', fontSize: 15, lineHeight: 21, marginTop: 6, marginBottom: 16 },
})