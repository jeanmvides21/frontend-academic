import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AsignaturasState } from './asignaturas.state';

export const selectAsignaturasState = createFeatureSelector<AsignaturasState>('asignaturas');

export const selectAllAsignaturas = createSelector(
  selectAsignaturasState,
  (state: AsignaturasState) => state.asignaturas
);

export const selectSelectedAsignatura = createSelector(
  selectAsignaturasState,
  (state: AsignaturasState) => state.selectedAsignatura
);

export const selectAsignaturasLoading = createSelector(
  selectAsignaturasState,
  (state: AsignaturasState) => state.loading
);

export const selectAsignaturasError = createSelector(
  selectAsignaturasState,
  (state: AsignaturasState) => state.error
);

export const selectAsignaturaById = (id: number) =>
  createSelector(selectAllAsignaturas, (asignaturas) =>
    asignaturas.find((a) => a.id === id)
  );

