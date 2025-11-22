import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsuariosState } from './usuarios.state';

export const selectUsuariosState = createFeatureSelector<UsuariosState>('usuarios');

export const selectAllUsuarios = createSelector(
  selectUsuariosState,
  (state: UsuariosState) => state.usuarios
);

export const selectSelectedUsuario = createSelector(
  selectUsuariosState,
  (state: UsuariosState) => state.selectedUsuario
);

export const selectUsuariosLoading = createSelector(
  selectUsuariosState,
  (state: UsuariosState) => state.loading
);

export const selectUsuariosError = createSelector(
  selectUsuariosState,
  (state: UsuariosState) => state.error
);

export const selectUsuarioById = (id: number) =>
  createSelector(selectAllUsuarios, (usuarios) =>
    usuarios.find((u) => u.id === id)
  );

