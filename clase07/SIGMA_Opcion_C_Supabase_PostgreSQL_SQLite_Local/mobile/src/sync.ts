import NetInfo from '@react-native-community/netinfo';
import { completeQueueItem, getQueue, markTaskError, replaceRemoteTasks, type Task } from './database';
import { supabase, supabaseConfigured } from './supabase';

export async function synchronize() {
  if (!supabaseConfigured) return { ok: false, message: 'Falta configurar .env con la URL y clave publicable de Supabase.' };
  const network = await NetInfo.fetch();
  if (!network.isConnected || network.isInternetReachable === false) return { ok: false, message: 'Sin conexión: los cambios siguen guardados en SQLite.' };

  const queue = await getQueue();
  for (const operation of queue) {
    const payload = JSON.parse(operation.payload) as Task;
    const result = operation.type === 'UPSERT'
      ? await supabase.from('tasks').upsert({ id: payload.id, title: payload.title, status: payload.status, updated_at: payload.updatedAt }, { onConflict: 'id' })
      : await supabase.from('tasks').delete().eq('id', operation.taskId);

    if (result.error) {
      await markTaskError(operation.taskId);
      return { ok: false, message: `No se pudo sincronizar: ${result.error.message}` };
    }
    await completeQueueItem(operation);
  }

  const { data, error } = await supabase.from('tasks').select('id,title,status,updated_at').order('updated_at', { ascending: false });
  if (error) return { ok: false, message: `Los cambios se enviaron, pero no se pudo descargar: ${error.message}` };
  await replaceRemoteTasks(data ?? []);
  return { ok: true, message: `${queue.length} operación(es) enviada(s) y datos remotos actualizados.` };
}
