import { createReducer, on } from '@ngrx/store';
import { AsignaturasState, initialAsignaturasState } from './asignaturas.state';
import * as AsignaturasActions from './asignaturas.actions';

export const asignaturasReducer = createReducer(
  initialAsignaturasState,
  
  // Load Asignaturas
  on(AsignaturasActions.loadAsignaturas, (state): AsignaturasState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(AsignaturasActions.loadAsignaturasSuccess, (state, { asignaturas }): AsignaturasState => ({
    ...state,
    asignaturas,
    loading: false,
    error: null,
  })),
  
  on(AsignaturasActions.loadAsignaturasFailure, (state, { error }): AsignaturasState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Load Asignatura by ID
  on(AsignaturasActions.loadAsignatura, (state): AsignaturasState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(AsignaturasActions.loadAsignaturaSuccess, (state, { asignatura }): AsignaturasState => ({
    ...state,
    selectedAsignatura: asignatura,
    loading: false,
    error: null,
  })),
  
  on(AsignaturasActions.loadAsignaturaFailure, (state, { error }): AsignaturasState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Create Asignatura
  on(AsignaturasActions.createAsignatura, (state): AsignaturasState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(AsignaturasActions.createAsignaturaSuccess, (state, { asignatura }): AsignaturasState => ({
    ...state,
    asignaturas: [...state.asignaturas, asignatura],
    loading: false,
    error: null,
  })),
  
  on(AsignaturasActions.createAsignaturaFailure, (state, { error }): AsignaturasState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Update Asignatura
  on(AsignaturasActions.updateAsignatura, (state): AsignaturasState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(AsignaturasActions.updateAsignaturaSuccess, (state, { asignatura }): AsignaturasState => ({
    ...state,
    asignaturas: state.asignaturas.map((a) => (a.id === asignatura.id ? asignatura : a)),
    selectedAsignatura: state.selectedAsignatura?.id === asignatura.id ? asignatura : state.selectedAsignatura,
    loading: false,
    error: null,
  })),
  
  on(AsignaturasActions.updateAsignaturaFailure, (state, { error }): AsignaturasState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Delete Asignatura
  on(AsignaturasActions.deleteAsignatura, (state): AsignaturasState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(AsignaturasActions.deleteAsignaturaSuccess, (state, { id }): AsignaturasState => ({
    ...state,
    asignaturas: state.asignaturas.filter((a) => a.id !== id),
    selectedAsignatura: state.selectedAsignatura?.id === id ? null : state.selectedAsignatura,
    loading: false,
    error: null,
  })),
  
  on(AsignaturasActions.deleteAsignaturaFailure, (state, { error }): AsignaturasState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Clear Error
  on(AsignaturasActions.clearAsignaturasError, (state): AsignaturasState => ({
    ...state,
    error: null,
  }))
);

