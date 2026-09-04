import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import MyButton from './components/myButton';

export default function App() {

  const [count, setCount] = useState(0);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hola Mundo
      </Text>
      <Text>Primera prueba de Aplicación en React Native!</Text>
      <Pressable style={styles.button}
        onPress={() => alert('Esto es una prueba de Botón!')}
        // onPress={() => setCount(count + 1)}
        // onLongPress={() => setCount(0)}
      >
        <Text>Presionar botón</Text>
      </Pressable>

      <Text style={styles.textHuge}>{count}</Text>

      <MyButton 
        label='+1 / Reset'
        // position='left'
        // onPress={() => alert('Botón Flotante Presionado!')}
        // onLongPress={() => alert('Botón Flotante Presionado por mucho tiempo!')}
        onPress={() => setCount(count + 1)}
        onLongPress={() => setCount(0)}
      />
      <MyButton 
        label='-1'
        position='left'
        onPress={() => setCount(count - 1)}
        // onLongPress={() => setCount(0)}
      />
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
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginTop: 20,
  },
   textHuge: {
    fontSize: 80,
    fontWeight: '100',
  },
});
