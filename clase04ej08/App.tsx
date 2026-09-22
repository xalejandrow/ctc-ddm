import { useState } from "react";
import { Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InventarioFlatList } from "./src/screens/InventarioFlatList";
import { InventarioScrollView } from "./src/screens/InventarioScrollView";
import { globalStyles as styles } from "./src/styles/globalStyles";
import { colors } from "./src/theme/theme";

type ModoLista = "flatlist" | "scrollview";

export default function App() {
  const [modoLista, setModoLista] = useState<ModoLista>("flatlist");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.brand}>SIGMA</Text>
        <Text style={styles.title}>Gestor de mantenimiento</Text>
        <Text style={styles.subtitle}>
          Inventario de hardware y estado operativo
        </Text>
      </View>

      <View style={styles.modeSelector}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: modoLista === "flatlist" }}
          onPress={() => setModoLista("flatlist")}
          style={[
            styles.modeButton,
            modoLista === "flatlist" && styles.modeButtonActive,
          ]}
        >
          <Text
            style={[
              styles.modeButtonText,
              modoLista === "flatlist" && styles.modeButtonTextActive,
            ]}
          >
            FlatList
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: modoLista === "scrollview" }}
          onPress={() => setModoLista("scrollview")}
          style={[
            styles.modeButton,
            modoLista === "scrollview" && styles.modeButtonActive,
          ]}
        >
          <Text
            style={[
              styles.modeButtonText,
              modoLista === "scrollview" && styles.modeButtonTextActive,
            ]}
          >
            ScrollView
          </Text>
        </Pressable>
      </View>

      {modoLista === "flatlist" ? (
        <InventarioFlatList />
      ) : (
        <InventarioScrollView />
      )}
    </SafeAreaView>
  );
}
