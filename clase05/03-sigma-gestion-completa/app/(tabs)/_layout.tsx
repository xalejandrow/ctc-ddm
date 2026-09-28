import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return <Tabs screenOptions={{ headerStyle: { backgroundColor: '#102A43' }, headerTintColor: '#FFFFFF', tabBarActiveTintColor: '#1877B9', tabBarLabelStyle: { fontSize: 11, fontWeight: '700' } }}>
    <Tabs.Screen name="equipos" options={{ title: 'Equipos', tabBarLabel: 'Equipos' }} />
    <Tabs.Screen name="tareas" options={{ title: 'Tareas', tabBarLabel: 'Tareas' }} />
    <Tabs.Screen name="nueva-tarea" options={{ title: 'Nueva tarea', tabBarLabel: 'Nueva tarea' }} />
    <Tabs.Screen name="nuevo-equipo" options={{ title: 'Nuevo equipo', tabBarLabel: 'Nuevo equipo' }} />
  </Tabs>;
}
