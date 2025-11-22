import { createReducer, on } from '@ngrx/store';
import { UsuariosState, initialUsuariosState } from './usuarios.state';
import * as UsuariosActions from './usuarios.actions';

export const usuariosReducer = createReducer(
  initialUsuariosState,
  
  // Load Usuarios
  on(UsuariosActions.loadUsuarios, (state): UsuariosState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(UsuariosActions.loadUsuariosSuccess, (state, { usuarios }): UsuariosState => ({
    ...state,
    usuarios,
    loading: false,
    error: null,
  })),
  
  on(UsuariosActions.loadUsuariosFailure, (state, { error }): UsuariosState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Load Usuario by ID
  on(UsuariosActions.loadUsuario, (state): UsuariosState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(UsuariosActions.loadUsuarioSuccess, (state, { usuario }): UsuariosState => ({
    ...state,
    selectedUsuario: usuario,
    loading: false,
    error: null,
  })),
  
  on(UsuariosActions.loadUsuarioFailure, (state, { error }): UsuariosState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Create Usuario
  on(UsuariosActions.createUsuario, (state): UsuariosState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(UsuariosActions.createUsuarioSuccess, (state, { usuario }): UsuariosState => ({
    ...state,
    usuarios: [...state.usuarios, usuario],
    loading: false,
    error: null,
  })),
  
  on(UsuariosActions.createUsuarioFailure, (state, { error }): UsuariosState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Update Usuario
  on(UsuariosActions.updateUsuario, (state): UsuariosState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(UsuariosActions.updateUsuarioSuccess, (state, { usuario }): UsuariosState => ({
    ...state,
    usuarios: state.usuarios.map((u) => (u.id === usuario.id ? usuario : u)),
    selectedUsuario: state.selectedUsuario?.id === usuario.id ? usuario : state.selectedUsuario,
    loading: false,
    error: null,
  })),
  
  on(UsuariosActions.updateUsuarioFailure, (state, { error }): UsuariosState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Delete Usuario
  on(UsuariosActions.deleteUsuario, (state): UsuariosState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(UsuariosActions.deleteUsuarioSuccess, (state, { id }): UsuariosState => ({
    ...state,
    usuarios: state.usuarios.filter((u) => u.id !== id),
    selectedUsuario: state.selectedUsuario?.id === id ? null : state.selectedUsuario,
    loading: false,
    error: null,
  })),
  
  on(UsuariosActions.deleteUsuarioFailure, (state, { error }): UsuariosState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Clear Error
  on(UsuariosActions.clearUsuariosError, (state): UsuariosState => ({
    ...state,
    error: null,
  }))
);

