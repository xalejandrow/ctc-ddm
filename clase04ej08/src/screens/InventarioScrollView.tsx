import { ScrollView, Text, View } from 'react-native';

import { EncabezadoInventario } from '../components/EncabezadoInventario';
import { TarjetaEquipo } from '../components/TarjetaEquipo';
import { equipos } from '../data/equipos';
import { globalStyles as styles } from '../styles/globalStyles';

export function InventarioScrollView() {
  return (
    <ScrollView
      style={styles.listScreen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <EncabezadoInventario equipos={equipos} tipoLista="ScrollView" />

      {equipos.length === 0 ? (
        <Text style={styles.empty}>No hay equipos registrados.</Text>
      ) : (
        equipos.map((equipo, index) => (
          <View
            key={equipo.id}
            style={index < equipos.length - 1 && styles.cardSpacing}
          >
            <TarjetaEquipo equipo={equipo} />
          </View>
        ))
      )}

      <Text style={styles.footerText}>Fin del inventario SIGMA</Text>
    </ScrollView>
  );
}
