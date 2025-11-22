import { Usuario } from './usuario.model';
import { Asignatura } from './asignatura.model';

export enum DiaSemana {
  LUNES = 'Lunes',
  MARTES = 'Martes',
  MIERCOLES = 'Miércoles',
  JUEVES = 'Jueves',
  VIERNES = 'Viernes',
  SABADO = 'Sábado',
  DOMINGO = 'Domingo',
}

export interface Horario {
  id: number;
  dia: DiaSemana;
  hora_inicio: string;
  hora_fin: string;
  id_usuario: number;
  id_asignatura: number;
  created_at?: string;
  updated_at?: string;
  usuario?: Usuario;
  asignatura?: Asignatura;
}

