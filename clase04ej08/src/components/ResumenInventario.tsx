import { Text, View } from 'react-native';

import { globalStyles as styles } from '../styles/globalStyles';
import type { Equipo } from '../types/Equipo';

interface ResumenInventarioProps {
  equipos: Equipo[];
}

export function ResumenInventario({ equipos }: ResumenInventarioProps) {
  const operativos = equipos.filter(
    (equipo) => equipo.estado === 'Operativo',
  ).length;
  const enMantenimiento = equipos.filter(
    (equipo) => equipo.estado === 'En mantenimiento',
  ).length;

  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{equipos.length}</Text>
        <Text style={styles.summaryLabel}>Total</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{operativos}</Text>
        <Text style={styles.summaryLabel}>Operativos</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{enMantenimiento}</Text>
        <Text style={styles.summaryLabel}>Mantenimiento</Text>
      </View>
    </View>
  );
}
