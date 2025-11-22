import { Horario } from '../../models/horario.model';

export interface HorariosState {
  horarios: Horario[];
  horariosByUsuario: { [usuarioId: number]: Horario[] };
  selectedHorario: Horario | null;
  loading: boolean;
  error: string | null;
}

export const initialHorariosState: HorariosState = {
  horarios: [],
  horariosByUsuario: {},
  selectedHorario: null,
  loading: false,
  error: null,
};

