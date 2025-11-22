import { Usuario } from './usuario.model';
import { Asignatura } from './asignatura.model';

export enum DiaSemana {
  LUNES = 'LUNES',
  MARTES = 'MARTES',
  MIERCOLES = 'MIERCOLES',
  JUEVES = 'JUEVES',
  VIERNES = 'VIERNES',
  SABADO = 'SABADO',
  DOMINGO = 'DOMINGO',
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

