import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HorariosState } from './horarios.state';

export const selectHorariosState = createFeatureSelector<HorariosState>('horarios');

export const selectAllHorarios = createSelector(
  selectHorariosState,
  (state: HorariosState) => state.horarios
);

export const selectSelectedHorario = createSelector(
  selectHorariosState,
  (state: HorariosState) => state.selectedHorario
);

export const selectHorariosLoading = createSelector(
  selectHorariosState,
  (state: HorariosState) => state.loading
);

export const selectHorariosError = createSelector(
  selectHorariosState,
  (state: HorariosState) => state.error
);

export const selectHorariosByUsuario = (idUsuario: number) =>
  createSelector(selectHorariosState, (state: HorariosState) =>
    state.horariosByUsuario[idUsuario] || []
  );

export const selectHorarioById = (id: number) =>
  createSelector(selectAllHorarios, (horarios) =>
    horarios.find((h) => h.id === id)
  );

