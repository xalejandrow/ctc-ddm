import { Text, View } from 'react-native';

import { globalStyles as styles } from '../styles/globalStyles';
import type { Equipo } from '../types/Equipo';
import { ResumenInventario } from './ResumenInventario';

interface EncabezadoInventarioProps {
  equipos: Equipo[];
  tipoLista: 'FlatList' | 'ScrollView';
}

export function EncabezadoInventario({
  equipos,
  tipoLista,
}: EncabezadoInventarioProps) {
  return (
    <>
      <ResumenInventario equipos={equipos} />

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Equipos registrados</Text>
        <Text style={styles.listDescription}>
          Vista generada con {tipoLista}. Los datos, componentes y estilos se
          encuentran en archivos externos.
        </Text>
      </View>
    </>
  );
}
