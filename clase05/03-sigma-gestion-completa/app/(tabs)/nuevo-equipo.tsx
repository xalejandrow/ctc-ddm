import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Field } from '../../components/Field';
import { OptionButtons } from '../../components/OptionButtons';
import { useSigma } from '../../context/SigmaContext';
import { Equipment } from '../../types/models';

type Errors = { name?: string; code?: string; location?: string };

export default function NuevoEquipoScreen() {
  const { addEquipment } = useSigma();
  const [name, setName] = useState(''); const [code, setCode] = useState(''); const [location, setLocation] = useState('');
  const [status, setStatus] = useState<Equipment['status']>('Operativo'); const [errors, setErrors] = useState<Errors>({});
  function save() {
    const next: Errors = {};
    if (name.trim().length < 3) next.name = 'Ingresá un nombre de al menos 3 caracteres.';
    if (code.trim().length < 3) next.code = 'Ingresá un código identificador.';
    if (location.trim().length < 3) next.location = 'Ingresá una ubicación.';
    setErrors(next); if (Object.keys(next).length) return;
    const equipment = addEquipment({ name: name.trim(), code: code.trim().toUpperCase(), location: location.trim(), status });
    Alert.alert('Equipo creado', 'El nuevo equipo se agregó al listado.', [{ text: 'Ver detalle', onPress: () => router.push(`/equipos/${equipment.id}`) }]);
  }
  return <ScrollView contentContainerStyle={styles.container}><Text style={styles.intro}>Registrá un activo para poder asignarle tareas.</Text>
    <Field label="Nombre del equipo" value={name} onChangeText={setName} placeholder="Ej.: Generador principal" error={errors.name} />
    <Field label="Código" value={code} onChangeText={setCode} autoCapitalize="characters" placeholder="Ej.: GEN-004" error={errors.code} />
    <Field label="Ubicación" value={location} onChangeText={setLocation} placeholder="Ej.: Sala eléctrica" error={errors.location} />
    <OptionButtons label="Estado" value={status} onChange={setStatus} options={['Operativo', 'En mantenimiento', 'Fuera de servicio']} />
    <Pressable style={styles.button} onPress={save}><Text style={styles.buttonText}>Guardar nuevo equipo</Text></Pressable>
  </ScrollView>;
}
const styles = StyleSheet.create({ container: { padding: 22, paddingBottom: 48, backgroundColor: '#FFFFFF', flexGrow: 1 }, intro: { color: '#52606D', fontSize: 16, lineHeight: 23, marginBottom: 20 }, button: { backgroundColor: '#16806A', padding: 16, alignItems: 'center', borderRadius: 10, marginTop: 8 }, buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' } });
