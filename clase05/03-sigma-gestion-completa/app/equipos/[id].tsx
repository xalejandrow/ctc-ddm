import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Field } from '../../components/Field';
import { OptionButtons } from '../../components/OptionButtons';
import { useSigma } from '../../context/SigmaContext';
import { Equipment } from '../../types/models';

export default function EquipoDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const { equipment, updateEquipment } = useSigma(); const item = equipment.find((current) => current.id === id);
  const [editing, setEditing] = useState(false); const [name, setName] = useState(item?.name ?? ''); const [code, setCode] = useState(item?.code ?? ''); const [location, setLocation] = useState(item?.location ?? ''); const [status, setStatus] = useState<Equipment['status']>(item?.status ?? 'Operativo');
  useEffect(() => { if (item) { setName(item.name); setCode(item.code); setLocation(item.location); setStatus(item.status); } }, [item]);
  if (!item) return <ScrollView contentContainerStyle={styles.container}><Text>Equipo no encontrado.</Text></ScrollView>;
  const itemId = item.id;
  function save() { if (name.trim().length < 3 || code.trim().length < 3 || location.trim().length < 3) return Alert.alert('Datos incompletos', 'Completá nombre, código y ubicación.'); updateEquipment(itemId, { name: name.trim(), code: code.trim().toUpperCase(), location: location.trim(), status }); setEditing(false); Alert.alert('Cambios guardados', 'El equipo fue actualizado.'); }
  return <ScrollView contentContainerStyle={styles.container}><Text style={styles.id}>{item.id.toUpperCase()}</Text><Text style={styles.title}>{editing ? 'Editar equipo' : item.name}</Text>
    {editing ? <><Field label="Nombre" value={name} onChangeText={setName} /><Field label="Código" value={code} onChangeText={setCode} autoCapitalize="characters" /><Field label="Ubicación" value={location} onChangeText={setLocation} /><OptionButtons label="Estado" value={status} onChange={setStatus} options={['Operativo', 'En mantenimiento', 'Fuera de servicio']} /><Pressable style={styles.save} onPress={save}><Text style={styles.buttonText}>Guardar cambios</Text></Pressable><Pressable style={styles.cancel} onPress={() => setEditing(false)}><Text style={styles.cancelText}>Cancelar</Text></Pressable></> : <><Text style={styles.label}>Código</Text><Text style={styles.value}>{item.code}</Text><Text style={styles.label}>Ubicación</Text><Text style={styles.value}>{item.location}</Text><Text style={styles.label}>Estado</Text><Text style={styles.value}>{item.status}</Text><Pressable style={styles.edit} onPress={() => setEditing(true)}><Text style={styles.buttonText}>Editar equipo</Text></Pressable></>}
  </ScrollView>;
}
const styles = StyleSheet.create({ container: { padding: 24, paddingBottom: 48, flexGrow: 1, backgroundColor: '#FFFFFF' }, id: { color: '#1877B9', fontWeight: '800' }, title: { color: '#102A43', fontSize: 27, fontWeight: '700', marginTop: 5, marginBottom: 20 }, label: { color: '#52606D', fontWeight: '700', fontSize: 14, marginTop: 17 }, value: { color: '#102A43', fontSize: 17, marginTop: 4 }, edit: { backgroundColor: '#1877B9', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 34 }, save: { backgroundColor: '#16806A', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 }, cancel: { padding: 15, alignItems: 'center' }, buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 }, cancelText: { color: '#52606D', fontWeight: '700' } });
