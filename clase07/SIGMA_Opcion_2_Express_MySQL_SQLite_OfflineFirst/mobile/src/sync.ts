import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { API_URL } from './config';
import { acknowledgeOperations, applyTasksFromServer, getPendingOperations, markOperationsAsError } from './database';
import { Task } from './types';

type RemoteTask = Omit<Task, 'syncStatus'>;

export async function synchronize() {
  const network = await NetInfo.fetch();
  if (!network.isConnected || network.isInternetReachable === false) {
    return { message: 'Sin conexion. Los cambios siguen guardados localmente.' };
  }

  const operations = await getPendingOperations();
  try {
    const response = await axios.post<{ acknowledgements: { queueId: number }[]; tasks: RemoteTask[] }>(
      `${API_URL}/sync`,
      { operations },
      { timeout: 8000 }
    );
    await acknowledgeOperations(response.data.acknowledgements.map((item) => item.queueId));
    await applyTasksFromServer(response.data.tasks);
    return { message: `${operations.length} operacion(es) sincronizada(s).` };
  } catch (error) {
    await markOperationsAsError(operations.map((operation) => operation.queueId));
    return { message: 'No se pudo sincronizar. La cola se conserva para reintentar.' };
  }
}
