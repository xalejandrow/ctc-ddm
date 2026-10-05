import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function InicioScreen() {
  const [estado, setEstado] = useState<'Pendiente' | 'En proceso' | 'Finalizada'>('Pendiente');

  const siguienteEstado = () => {
    setEstado((actual) => actual === 'Pendiente' ? 'En proceso' : actual === 'En proceso' ? 'Finalizada' : 'Pendiente');
  };

  const colorEstado = estado === 'Finalizada' ? 'bg-emerald-100 text-emerald-800' : estado === 'En proceso' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800';

  return (
    
      <SafeAreaProvider className="flex-1 bg-slate-100">
      {/* <SafeAreaView className="flex-1 bg-slate-100"> */}
        <View className="flex-1 p-6 justify-center">
          <Text className="text-sky-700 text-sm font-bold tracking-widest">SIGMA · NATIVEWIND v1</Text>
          <Text className= "bg-white-100 text-red-100 text-sm font-bold tracking-widest">SIGMA · NATIVEWIND v2</Text>
          <Text className="mt-2 text-3xl font-bold text-slate-900">Orden de trabajo</Text>
          <Text className="mt-2 text-base leading-6 text-slate-600">Ejemplo básico de estilos mediante className.</Text>

        <View className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-sky-700">OT-104</Text>
            <Text className={`rounded-full px-3 py-1 text-xs font-bold ${colorEstado}`}>{estado}</Text>
            <Text className="rounded-full px-3 py-1 text-xs font-bold ${colorEstado}">{estado}</Text>
          </View>
          <Text className="mt-4 text-xl font-bold text-slate-900">Revisar bomba de agua</Text>
          <Text className="mt-2 text-base leading-6 text-slate-600">Sala de máquinas · Bomba centrífuga 01</Text>
        </View>

        <Pressable onPress={siguienteEstado} className="mt-5 rounded-xl bg-sky-700 px-5 py-4 active:bg-sky-800">
          <Text className="text-center text-base font-bold text-white">Cambiar estado</Text>
        </Pressable>

        <Text className="mt-5 text-center text-xs text-slate-500">Cada className reemplaza un objeto StyleSheet local.</Text>
      </View>
    {/* </SafeAreaView> */}
    </SafeAreaProvider>
  );
}
