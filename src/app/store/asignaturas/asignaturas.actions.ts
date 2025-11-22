import { createAction, props } from '@ngrx/store';
import { Asignatura } from '../../models/asignatura.model';

// Load Asignaturas
export const loadAsignaturas = createAction('[Asignaturas] Load Asignaturas');

export const loadAsignaturasSuccess = createAction(
  '[Asignaturas] Load Asignaturas Success',
  props<{ asignaturas: Asignatura[] }>()
);

export const loadAsignaturasFailure = createAction(
  '[Asignaturas] Load Asignaturas Failure',
  props<{ error: string }>()
);

// Load Asignatura by ID
export const loadAsignatura = createAction(
  '[Asignaturas] Load Asignatura',
  props<{ id: number }>()
);

export const loadAsignaturaSuccess = createAction(
  '[Asignaturas] Load Asignatura Success',
  props<{ asignatura: Asignatura }>()
);

export const loadAsignaturaFailure = createAction(
  '[Asignaturas] Load Asignatura Failure',
  props<{ error: string }>()
);

// Create Asignatura
export const createAsignatura = createAction(
  '[Asignaturas] Create Asignatura',
  props<{ asignatura: Partial<Asignatura> }>()
);

export const createAsignaturaSuccess = createAction(
  '[Asignaturas] Create Asignatura Success',
  props<{ asignatura: Asignatura }>()
);

export const createAsignaturaFailure = createAction(
  '[Asignaturas] Create Asignatura Failure',
  props<{ error: string }>()
);

// Update Asignatura
export const updateAsignatura = createAction(
  '[Asignaturas] Update Asignatura',
  props<{ id: number; asignatura: Partial<Asignatura> }>()
);

export const updateAsignaturaSuccess = createAction(
  '[Asignaturas] Update Asignatura Success',
  props<{ asignatura: Asignatura }>()
);

export const updateAsignaturaFailure = createAction(
  '[Asignaturas] Update Asignatura Failure',
  props<{ error: string }>()
);

// Delete Asignatura
export const deleteAsignatura = createAction(
  '[Asignaturas] Delete Asignatura',
  props<{ id: number }>()
);

export const deleteAsignaturaSuccess = createAction(
  '[Asignaturas] Delete Asignatura Success',
  props<{ id: number }>()
);

export const deleteAsignaturaFailure = createAction(
  '[Asignaturas] Delete Asignatura Failure',
  props<{ error: string }>()
);

// Clear Error
export const clearAsignaturasError = createAction('[Asignaturas] Clear Error');

