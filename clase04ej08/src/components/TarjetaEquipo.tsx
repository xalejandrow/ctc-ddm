import { Text, View } from 'react-native';

import { globalStyles as styles } from '../styles/globalStyles';
import { statusColors } from '../theme/theme';
import type { Equipo } from '../types/Equipo';

interface TarjetaEquipoProps {
  equipo: Equipo;
}

export function TarjetaEquipo({ equipo }: TarjetaEquipoProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInformation}>
          <Text style={styles.equipmentCode}>{equipo.codigo}</Text>
          <Text style={styles.equipmentName}>{equipo.nombre}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[equipo.estado] },
          ]}
        >
          <Text style={styles.statusText}>{equipo.estado}</Text>
        </View>
      </View>

      <Text style={styles.metadata}>Tipo: {equipo.tipo}</Text>
      <Text style={styles.metadata}>Ubicación: {equipo.ubicacion}</Text>
      <Text style={styles.metadata}>Responsable: {equipo.responsable}</Text>
      <Text style={styles.metadata}>
        Última revisión: {equipo.ultimaRevision}
      </Text>
    </View>
  );
}
