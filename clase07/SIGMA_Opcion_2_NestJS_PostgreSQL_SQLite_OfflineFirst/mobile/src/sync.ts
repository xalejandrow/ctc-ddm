import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { API_URL } from "./config";
import { acknowledge, markError, pending } from "./database";
export async function synchronize() {
  const state = await NetInfo.fetch();
  if (!state.isConnected || state.isInternetReachable === false)
    return { message: "Sin conexión" };
  let sent = 0;
  for (const op of await pending()) {
    try {
      if (op.type === "CREATE") await axios.post(`${API_URL}/tasks`, op.task);
      if (op.type === "UPDATE")
        await axios.patch(`${API_URL}/tasks/${op.task.id}`, op.task);
      if (op.type === "DELETE")
        await axios.delete(`${API_URL}/tasks/${op.task.id}`);
      await acknowledge(op.id, op.task);
      sent++;
    } catch {
      await markError(op.task);
      break;
    }
  }
  return { message: `${sent} operación(es) enviadas` };
}
