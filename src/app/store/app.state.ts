import { AuthState } from './auth/auth.state';
import { UsuariosState } from './usuarios/usuarios.state';
import { AsignaturasState } from './asignaturas/asignaturas.state';
import { HorariosState } from './horarios/horarios.state';

export interface AppState {
  auth: AuthState;
  usuarios: UsuariosState;
  asignaturas: AsignaturasState;
  horarios: HorariosState;
}

