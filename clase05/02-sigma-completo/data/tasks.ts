import { Task } from '../types/task';

export const tasks: Task[] = [
  { id: 'OT-104', title: 'Revisar bomba de agua', asset: 'Bomba centrífuga 01', priority: 'Alta', description: 'La bomba presenta vibración y pérdida de presión.' },
  { id: 'OT-105', title: 'Cambiar filtro de aire', asset: 'Compresor A2', priority: 'Media', description: 'Realizar mantenimiento preventivo mensual.' },
  { id: 'OT-106', title: 'Verificar cableado', asset: 'Tablero eléctrico Norte', priority: 'Alta', description: 'Revisar borneras y señalizar los cables deteriorados.' },
];

export function getTaskById(id?: string) {
  return tasks.find((task) => task.id === id);
}
