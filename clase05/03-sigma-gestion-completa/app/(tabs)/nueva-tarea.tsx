import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Field } from '../../components/Field';
import { OptionButtons } from '../../components/OptionButtons';
import { useSigma } from '../../context/SigmaContext';
import { Task } from '../../types/models';

type Errors = { title?: string; description?: string; equipment?: string };
export default function NuevaTareaScreen() {
  const { equipment, addTask } = useSigma();
  const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [equipmentId, setEquipmentId] = useState(equipment[0]?.id ?? '');
  const [priority, setPriority] = useState<Task['priority']>('Media'); const [status, setStatus] = useState<Task['status']>('Pendiente'); const [errors, setErrors] = useState<Errors>({});
  function save() {
    const next: Errors = {};
    if (title.trim().length < 4) next.title = 'Ingresá un título de al menos 4 caracteres.';
    if (description.trim().length < 10) next.description = 'Describí la tarea con al menos 10 caracteres.';
    if (!equipmentId) next.equipment = 'Primero creá o seleccioná un equipo.';
    setErrors(next); if (Object.keys(next).length) return;
    const task = addTask({ title: title.trim(), description: description.trim(), equipmentId, priority, status });
    Alert.alert('Tarea creada', 'La orden se agregó al listado.', [{ text: 'Ver detalle', onPress: () => router.push(`/tareas/${task.id}`) }]);
  }
  return <ScrollView contentContainerStyle={styles.container}><Text style={styles.intro}>Creá una orden y asignala a un equipo existente.</Text>
    <Field label="Título de la tarea" value={title} onChangeText={setTitle} placeholder="Ej.: Ajustar correa del motor" error={errors.title} />
    <Field label="Descripción" value={description} onChangeText={setDescription} placeholder="Explicá qué debe revisar el técnico." multiline error={errors.description} />
    <Text style={styles.label}>Equipo asignado</Text><View style={styles.choices}>{equipment.map((item) => <Pressable key={item.id} onPress={() => setEquipmentId(item.id)} style={[styles.choice, equipmentId === item.id && styles.choiceSelected]}><Text style={[styles.choiceText, equipmentId === item.id && styles.choiceTextSelected]}>{item.code} · {item.name}</Text></Pressable>)}</View>
    {errors.equipment ? <Text style={styles.error}>{errors.equipment}</Text> : null}
    <OptionButtons label="Prioridad" value={priority} onChange={setPriority} options={['Alta', 'Media', 'Baja']} />
    <OptionButtons label="Estado inicial" value={status} onChange={setStatus} options={['Pendiente', 'En proceso', 'Finalizada']} />
    <Pressable style={styles.button} onPress={save}><Text style={styles.buttonText}>Guardar nueva tarea</Text></Pressable>
  </ScrollView>;
}
const styles = StyleSheet.create({ container: { padding: 22, paddingBottom: 48, backgroundColor: '#FFFFFF', flexGrow: 1 }, intro: { color: '#52606D', fontSize: 16, lineHeight: 23, marginBottom: 20 }, label: { color: '#102A43', fontWeight: '700', marginBottom: 8 }, choices: { gap: 8, marginBottom: 16 }, choice: { borderWidth: 1, borderColor: '#BCCCDC', padding: 12, borderRadius: 9 }, choiceSelected: { borderColor: '#1877B9', backgroundColor: '#E6F4FA' }, choiceText: { color: '#52606D' }, choiceTextSelected: { color: '#102A43', fontWeight: '700' }, error: { color: '#C63B3B', marginTop: -10, marginBottom: 14, fontSize: 13 }, button: { backgroundColor: '#1877B9', padding: 16, alignItems: 'center', borderRadius: 10, marginTop: 8 }, buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' } });
