import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App01 from './src/01_Hola_SIGMA/App';
import App02 from './src/02_Panel_y_Flexbox/App';
import App03 from './src/03_Lista_de_Equipos/App';
import App04 from './src/04_Componente_Estado/App';
import App05 from './src/05_Componente_Equipo/App';
import App06 from './src/06_Interfaz_Adaptable/App';
import App07 from './src/07_Proyecto_Integrador/App';

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      {/* <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" /> */}
      {/* <App01 /> */}
      {/* <App02 /> */}
      {/* <App03 /> */}
      {/* <App04 /> */}
      {/* <App05 /> */}
      {/* <App06 /> */}
      <App07 />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
