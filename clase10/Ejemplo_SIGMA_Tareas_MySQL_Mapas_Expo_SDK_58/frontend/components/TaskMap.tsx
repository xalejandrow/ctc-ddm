import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Task } from "@/types/task";
// JL -34.428473, -57.438332
// const FALLBACK: Region = {
//   latitude: -34.428,
//   longitude: -57.438,
//   latitudeDelta: 0.12,
//   longitudeDelta: 0.12,
// };
const FALLBACK: Region = {
  latitude: -34.905,
  longitude: -56.191,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};
export function TaskMap({
  tasks,
  height = 250,
}: {
  tasks: Task[];
  height?: number;
}) {
  const first = tasks.find(
    (task) => task.latitude !== null && task.longitude !== null,
  );
  if (!first)
    return (
      <View style={[styles.empty, { height }]}>
        <Text>Esta tarea todavía no tiene una ubicación asociada.</Text>
      </View>
    );
  const region: Region = {
    latitude: Number(first.latitude),
    longitude: Number(first.longitude),
    latitudeDelta: 0.018,
    longitudeDelta: 0.018,
  };
  return (
    <MapView
      style={{ height }}
      initialRegion={region}
      region={tasks.length === 1 ? region : undefined}
    >
      {tasks
        .filter((t) => t.latitude !== null && t.longitude !== null)
        .map((task) => (
          <Marker
            key={task.id}
            coordinate={{
              latitude: Number(task.latitude),
              longitude: Number(task.longitude),
            }}
            title={task.title}
            description={`${task.status}${task.location_accuracy ? ` · ±${Math.round(Number(task.location_accuracy))} m` : ""}`}
          />
        ))}
    </MapView>
  );
}
const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8eef5",
    padding: 20,
  },
});
