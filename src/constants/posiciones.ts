import { Option } from '../components/common/SelectableCardGroup';

export type Posicion = 'Base' | 'Escolta' | 'Alero' | 'Ala Pivot' | 'Pivot';

export const posiciones: Option<Posicion>[] = [
  {
    label: 'Base',
    description: 'Organiza el juego y dirige al equipo (Point Guard)',
    value: 'Base',
  },
  {
    label: 'Escolta',
    description: 'Especialista en el tiro exterior (Shooting Guard)',
    value: 'Escolta',
  },
  {
    label: 'Alero',
    description: 'Versátil en defensa y ataque (Small Forward)',
    value: 'Alero',
  },
  {
    label: 'Ala Pivot',
    description: 'Combina fuerza y agilidad cerca del aro (Power Forward)',
    value: 'Ala Pivot',
  },
  {
    label: 'Pivot',
    description: 'Domina la pintura y protege el aro (Center)',
    value: 'Pivot',
  },
];
