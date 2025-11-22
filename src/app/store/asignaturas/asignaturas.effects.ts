import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Asignatura } from '../../models/asignatura.model';
import * as AsignaturasActions from './asignaturas.actions';

@Injectable()
export class AsignaturasEffects {
  private apiUrl = 'http://localhost:3000/api/asignaturas';
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadAsignaturas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AsignaturasActions.loadAsignaturas),
      switchMap(() =>
        this.http.get<{ data: Asignatura[] }>(this.apiUrl).pipe(
          map((response) =>
            AsignaturasActions.loadAsignaturasSuccess({ asignaturas: response.data })
          ),
          catchError((error) =>
            of(
              AsignaturasActions.loadAsignaturasFailure({
                error: error.error?.message || 'Error al cargar asignaturas',
              })
            )
          )
        )
      )
    )
  );

  loadAsignatura$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AsignaturasActions.loadAsignatura),
      switchMap(({ id }) =>
        this.http.get<{ data: Asignatura }>(`${this.apiUrl}/${id}`).pipe(
          map((response) =>
            AsignaturasActions.loadAsignaturaSuccess({ asignatura: response.data })
          ),
          catchError((error) =>
            of(
              AsignaturasActions.loadAsignaturaFailure({
                error: error.error?.message || 'Error al cargar asignatura',
              })
            )
          )
        )
      )
    )
  );

  createAsignatura$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AsignaturasActions.createAsignatura),
      switchMap(({ asignatura }) =>
        this.http.post<{ data: Asignatura }>(this.apiUrl, asignatura).pipe(
          map((response) =>
            AsignaturasActions.createAsignaturaSuccess({ asignatura: response.data })
          ),
          catchError((error) =>
            of(
              AsignaturasActions.createAsignaturaFailure({
                error: error.error?.message || 'Error al crear asignatura',
              })
            )
          )
        )
      )
    )
  );

  updateAsignatura$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AsignaturasActions.updateAsignatura),
      switchMap(({ id, asignatura }) =>
        this.http.patch<{ data: Asignatura }>(`${this.apiUrl}/${id}`, asignatura).pipe(
          map((response) =>
            AsignaturasActions.updateAsignaturaSuccess({ asignatura: response.data })
          ),
          catchError((error) =>
            of(
              AsignaturasActions.updateAsignaturaFailure({
                error: error.error?.message || 'Error al actualizar asignatura',
              })
            )
          )
        )
      )
    )
  );

  deleteAsignatura$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AsignaturasActions.deleteAsignatura),
      switchMap(({ id }) =>
        this.http.delete(`${this.apiUrl}/${id}`).pipe(
          map(() => AsignaturasActions.deleteAsignaturaSuccess({ id })),
          catchError((error) =>
            of(
              AsignaturasActions.deleteAsignaturaFailure({
                error: error.error?.message || 'Error al eliminar asignatura',
              })
            )
          )
        )
      )
    )
  );
}

