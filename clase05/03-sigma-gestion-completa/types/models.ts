export type Equipment = {
  id: string;
  name: string;
  code: string;
  location: string;
  status: 'Operativo' | 'En mantenimiento' | 'Fuera de servicio';
};

export type Task = {
  id: string;
  title: string;
  equipmentId: string;
  priority: 'Alta' | 'Media' | 'Baja';
  description: string;
  status: 'Pendiente' | 'En proceso' | 'Finalizada';
};
