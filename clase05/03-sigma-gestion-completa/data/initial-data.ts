import { Equipment, Task } from '../types/models';

export const initialEquipment: Equipment[] = [
  { id: 'eq-1', name: 'Bomba centrífuga 01', code: 'BOM-001', location: 'Sala de máquinas', status: 'Operativo' },
  { id: 'eq-2', name: 'Compresor A2', code: 'COM-002', location: 'Taller', status: 'En mantenimiento' },
  { id: 'eq-3', name: 'Tablero eléctrico Norte', code: 'TAB-003', location: 'Depósito', status: 'Operativo' },
];

export const initialTasks: Task[] = [
  { id: 'ot-104', title: 'Revisar bomba de agua', equipmentId: 'eq-1', priority: 'Alta', description: 'Revisar vibración y pérdida de presión.', status: 'Pendiente' },
  { id: 'ot-105', title: 'Cambiar filtro de aire', equipmentId: 'eq-2', priority: 'Media', description: 'Realizar mantenimiento preventivo mensual.', status: 'En proceso' },
  { id: 'ot-106', title: 'Verificar cableado', equipmentId: 'eq-3', priority: 'Alta', description: 'Revisar borneras y señalizar cables deteriorados.', status: 'Pendiente' },
];
