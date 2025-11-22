import { Usuario } from '../../models/usuario.model';

export interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

