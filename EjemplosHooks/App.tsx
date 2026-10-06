import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import App01 from './app/01-useState/App';
import App02 from './app/02-useEffect/App';
import App03 from './app/03-useContext/App';
import App04 from './app/04-useRef/App';
import App05 from './app/05-useMemo/App';
import App06 from './app/06-useCallback/App';
import App07 from './app/07-useReducer/App';
import App08 from './app/08-useWindowDimensions/App';
import App09 from './app/09-useColorScheme/App';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Text>Open up App.tsx to start working on your app!</Text> */}
      <App01 />
      {/* <App02 /> */}
      {/* <App03 /> */}
      {/* <App04 /> */}
      {/* <App05 /> */}
      {/* <App06 /> */}
      {/* <App07 /> */}
      {/* <App08 /> */}
      {/* <App09 /> */}
      <StatusBar style="auto" />
    </View>
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
