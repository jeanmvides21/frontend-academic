import { createAction, props } from '@ngrx/store';
import { Usuario } from '../../models/usuario.model';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ correo: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: Usuario }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Load User from Storage
export const loadUserFromStorage = createAction('[Auth] Load User From Storage');

export const loadUserFromStorageSuccess = createAction(
  '[Auth] Load User From Storage Success',
  props<{ user: Usuario }>()
);

// Clear Error
export const clearAuthError = createAction('[Auth] Clear Error');

