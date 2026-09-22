export type EstadoEquipo =
  | 'Operativo'
  | 'En mantenimiento'
  | 'Fuera de servicio';

export interface Equipo {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  ubicacion: string;
  responsable: string;
  estado: EstadoEquipo;
  ultimaRevision: string;
}
