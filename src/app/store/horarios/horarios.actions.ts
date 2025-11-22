import { createAction, props } from '@ngrx/store';
import { Horario } from '../../models/horario.model';

// Load Horarios
export const loadHorarios = createAction('[Horarios] Load Horarios');

export const loadHorariosSuccess = createAction(
  '[Horarios] Load Horarios Success',
  props<{ horarios: Horario[] }>()
);

export const loadHorariosFailure = createAction(
  '[Horarios] Load Horarios Failure',
  props<{ error: string }>()
);

// Load Horarios by Usuario
export const loadHorariosByUsuario = createAction(
  '[Horarios] Load Horarios By Usuario',
  props<{ idUsuario: number }>()
);

export const loadHorariosByUsuarioSuccess = createAction(
  '[Horarios] Load Horarios By Usuario Success',
  props<{ idUsuario: number; horarios: Horario[] }>()
);

export const loadHorariosByUsuarioFailure = createAction(
  '[Horarios] Load Horarios By Usuario Failure',
  props<{ error: string }>()
);

// Load Horario by ID
export const loadHorario = createAction(
  '[Horarios] Load Horario',
  props<{ id: number }>()
);

export const loadHorarioSuccess = createAction(
  '[Horarios] Load Horario Success',
  props<{ horario: Horario }>()
);

export const loadHorarioFailure = createAction(
  '[Horarios] Load Horario Failure',
  props<{ error: string }>()
);

// Create Horario
export const createHorario = createAction(
  '[Horarios] Create Horario',
  props<{ horario: Partial<Horario> }>()
);

export const createHorarioSuccess = createAction(
  '[Horarios] Create Horario Success',
  props<{ horario: Horario }>()
);

export const createHorarioFailure = createAction(
  '[Horarios] Create Horario Failure',
  props<{ error: string }>()
);

// Update Horario
export const updateHorario = createAction(
  '[Horarios] Update Horario',
  props<{ id: number; horario: Partial<Horario> }>()
);

export const updateHorarioSuccess = createAction(
  '[Horarios] Update Horario Success',
  props<{ horario: Horario }>()
);

export const updateHorarioFailure = createAction(
  '[Horarios] Update Horario Failure',
  props<{ error: string }>()
);

// Delete Horario
export const deleteHorario = createAction(
  '[Horarios] Delete Horario',
  props<{ id: number }>()
);

export const deleteHorarioSuccess = createAction(
  '[Horarios] Delete Horario Success',
  props<{ id: number }>()
);

export const deleteHorarioFailure = createAction(
  '[Horarios] Delete Horario Failure',
  props<{ error: string }>()
);

// Clear Error
export const clearHorariosError = createAction('[Horarios] Clear Error');

