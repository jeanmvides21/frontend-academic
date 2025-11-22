import { createAction, props } from '@ngrx/store';
import { Usuario } from '../../models/usuario.model';

// Load Usuarios
export const loadUsuarios = createAction('[Usuarios] Load Usuarios');

export const loadUsuariosSuccess = createAction(
  '[Usuarios] Load Usuarios Success',
  props<{ usuarios: Usuario[] }>()
);

export const loadUsuariosFailure = createAction(
  '[Usuarios] Load Usuarios Failure',
  props<{ error: string }>()
);

// Load Usuario by ID
export const loadUsuario = createAction(
  '[Usuarios] Load Usuario',
  props<{ id: number }>()
);

export const loadUsuarioSuccess = createAction(
  '[Usuarios] Load Usuario Success',
  props<{ usuario: Usuario }>()
);

export const loadUsuarioFailure = createAction(
  '[Usuarios] Load Usuario Failure',
  props<{ error: string }>()
);

// Create Usuario
export const createUsuario = createAction(
  '[Usuarios] Create Usuario',
  props<{ usuario: Partial<Usuario> }>()
);

export const createUsuarioSuccess = createAction(
  '[Usuarios] Create Usuario Success',
  props<{ usuario: Usuario }>()
);

export const createUsuarioFailure = createAction(
  '[Usuarios] Create Usuario Failure',
  props<{ error: string }>()
);

// Update Usuario
export const updateUsuario = createAction(
  '[Usuarios] Update Usuario',
  props<{ id: number; usuario: Partial<Usuario> }>()
);

export const updateUsuarioSuccess = createAction(
  '[Usuarios] Update Usuario Success',
  props<{ usuario: Usuario }>()
);

export const updateUsuarioFailure = createAction(
  '[Usuarios] Update Usuario Failure',
  props<{ error: string }>()
);

// Delete Usuario
export const deleteUsuario = createAction(
  '[Usuarios] Delete Usuario',
  props<{ id: number }>()
);

export const deleteUsuarioSuccess = createAction(
  '[Usuarios] Delete Usuario Success',
  props<{ id: number }>()
);

export const deleteUsuarioFailure = createAction(
  '[Usuarios] Delete Usuario Failure',
  props<{ error: string }>()
);

// Clear Error
export const clearUsuariosError = createAction('[Usuarios] Clear Error');

