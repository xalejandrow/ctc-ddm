import { StyleSheet, Text, View } from 'react-native';
import { Task } from '../types';
export function TaskItem({ task }: { task: Task }) { return <View style={styles.item}><Text style={styles.title}>{task.title}</Text><Text style={styles.status}>{task.status}</Text></View>; }
const styles = StyleSheet.create({ item: { backgroundColor: 'white', borderWidth: 1, borderColor: '#D6E0EA', borderRadius: 8, padding: 14, marginBottom: 10 }, title: { color: '#102A43', fontWeight: '700', fontSize: 16 }, status: { color: '#0F8B8D', marginTop: 4 } });
