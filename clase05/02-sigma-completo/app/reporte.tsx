import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FormInput } from '../components/FormInput';

type Errors = { descripcion?: string; horas?: string };

export default function ReporteScreen() {
  const { tareaId } = useLocalSearchParams<{ tareaId: string }>();
  const [descripcion, setDescripcion] = useState('');
  const [horas, setHoras] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  function validarReporte() {
    const nuevosErrores: Errors = {};
    if (descripcion.trim().length < 10) {
      nuevosErrores.descripcion = 'Escribí una descripción de al menos 10 caracteres.';
    }

    const horasNumero = Number(horas);
    if (!horas || Number.isNaN(horasNumero) || horasNumero <= 0) {
      nuevosErrores.horas = 'Ingresá una cantidad de horas mayor que cero.';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function guardarReporte() {
    if (!validarReporte()) return;

    const reporte = { tareaId, descripcion: descripcion.trim(), horas: Number(horas) };
    console.log('Reporte válido:', reporte);
    Alert.alert('Reporte guardado', `Se registró el reporte de la orden ${tareaId}.`, [
      { text: 'Aceptar', onPress: () => router.back() },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Reporte de mantenimiento</Text>
      <View style={styles.taskBadge}><Text style={styles.taskBadgeText}>Orden: {tareaId}</Text></View>

      <FormInput
        label="Descripción del trabajo realizado"
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Ej.: se ajustó la correa y se probó el equipo"
        multiline
        error={errors.descripcion}
      />
      <FormInput
        label="Horas trabajadas"
        value={horas}
        onChangeText={setHoras}
        placeholder="Ej.: 2.5"
        keyboardType="decimal-pad"
        error={errors.horas}
      />

      <Pressable style={styles.button} onPress={guardarReporte}>
        <Text style={styles.buttonText}>Guardar reporte</Text>
      </Pressable>
      <Text style={styles.help}>Probá guardar vacío, con horas 0 y con datos válidos.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 48, backgroundColor: '#FFFFFF', flexGrow: 1 },
  title: { fontSize: 26, color: '#102A43', fontWeight: '700' },
  taskBadge: { alignSelf: 'flex-start', backgroundColor: '#DDF5F2', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, marginTop: 12, marginBottom: 18 },
  taskBadgeText: { color: '#16806A', fontWeight: '700' },
  button: { backgroundColor: '#1877B9', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  help: { color: '#52606D', fontSize: 13, lineHeight: 18, marginTop: 16, textAlign: 'center' },
});
