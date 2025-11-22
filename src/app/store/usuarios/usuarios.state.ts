import { Usuario } from '../../models/usuario.model';

export interface UsuariosState {
  usuarios: Usuario[];
  selectedUsuario: Usuario | null;
  loading: boolean;
  error: string | null;
}

export const initialUsuariosState: UsuariosState = {
  usuarios: [],
  selectedUsuario: null,
  loading: false,
  error: null,
};

