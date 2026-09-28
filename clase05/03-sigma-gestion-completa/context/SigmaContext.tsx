import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { initialEquipment, initialTasks } from '../data/initial-data';
import { Equipment, Task } from '../types/models';

type EquipmentInput = Omit<Equipment, 'id'>;
type TaskInput = Omit<Task, 'id'>;

type SigmaContextValue = {
  equipment: Equipment[];
  tasks: Task[];
  addEquipment: (input: EquipmentInput) => Equipment;
  updateEquipment: (id: string, input: EquipmentInput) => void;
  addTask: (input: TaskInput) => Task;
  updateTask: (id: string, input: TaskInput) => void;
};

const SigmaContext = createContext<SigmaContextValue | undefined>(undefined);
const createId = (prefix: string) => `${prefix}-${Date.now()}`;

export function SigmaProvider({ children }: PropsWithChildren) {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  function addEquipment(input: EquipmentInput) {
    const created = { id: createId('eq'), ...input };
    setEquipment((current) => [...current, created]);
    return created;
  }
  function updateEquipment(id: string, input: EquipmentInput) {
    setEquipment((current) => current.map((item) => item.id === id ? { id, ...input } : item));
  }
  function addTask(input: TaskInput) {
    const created = { id: createId('ot'), ...input };
    setTasks((current) => [...current, created]);
    return created;
  }
  function updateTask(id: string, input: TaskInput) {
    setTasks((current) => current.map((item) => item.id === id ? { id, ...input } : item));
  }

  return <SigmaContext.Provider value={{ equipment, tasks, addEquipment, updateEquipment, addTask, updateTask }}>{children}</SigmaContext.Provider>;
}

export function useSigma() {
  const value = useContext(SigmaContext);
  if (!value) throw new Error('useSigma debe usarse dentro de SigmaProvider');
  return value;
}
