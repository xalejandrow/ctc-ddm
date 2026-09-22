import { FlatList, Text, View } from 'react-native';

import { EncabezadoInventario } from '../components/EncabezadoInventario';
import { TarjetaEquipo } from '../components/TarjetaEquipo';
import { equipos } from '../data/equipos';
import { globalStyles as styles } from '../styles/globalStyles';

export function InventarioFlatList() {
  return (
    <FlatList
      style={styles.listScreen}
      contentContainerStyle={styles.flatListContent}
      data={equipos}
      keyExtractor={(equipo) => equipo.id}
      renderItem={({ item }) => <TarjetaEquipo equipo={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <EncabezadoInventario equipos={equipos} tipoLista="FlatList" />
      }
      ListEmptyComponent={
        <Text style={styles.empty}>No hay equipos registrados.</Text>
      }
      ListFooterComponent={
        <Text style={styles.footerText}>Fin del inventario SIGMA</Text>
      }
      showsVerticalScrollIndicator={false}
    />
  );
}
