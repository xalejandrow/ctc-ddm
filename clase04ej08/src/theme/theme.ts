import type { EstadoEquipo } from '../types/Equipo';

export const colors = {
  primary: '#155EEF',
  primaryDark: '#0B3B91',
  primarySoft: '#E8F0FF',
  background: '#F4F7FB',
  surface: '#FFFFFF',
  text: '#172B4D',
  textMuted: '#5E6C84',
  border: '#DDE3EC',
  shadow: '#091E42',
  success: '#16803C',
  warning: '#B54708',
  danger: '#B42318',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

export const statusColors: Record<EstadoEquipo, string> = {
  Operativo: colors.success,
  'En mantenimiento': colors.warning,
  'Fuera de servicio': colors.danger,
};
