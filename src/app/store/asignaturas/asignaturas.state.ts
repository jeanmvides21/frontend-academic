import { Asignatura } from '../../models/asignatura.model';

export interface AsignaturasState {
  asignaturas: Asignatura[];
  selectedAsignatura: Asignatura | null;
  loading: boolean;
  error: string | null;
}

export const initialAsignaturasState: AsignaturasState = {
  asignaturas: [],
  selectedAsignatura: null,
  loading: false,
  error: null,
};

