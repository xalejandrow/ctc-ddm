export type Task = {
  id: string;
  title: string;
  asset: string;
  priority: 'Alta' | 'Media' | 'Baja';
  description: string;
};
