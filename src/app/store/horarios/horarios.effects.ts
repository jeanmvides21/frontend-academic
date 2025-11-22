import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Horario } from '../../models/horario.model';
import * as HorariosActions from './horarios.actions';

@Injectable()
export class HorariosEffects {
  private apiUrl = 'http://localhost:3000/api/horarios';
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadHorarios$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HorariosActions.loadHorarios),
      switchMap(() =>
        this.http.get<{ data: Horario[] }>(this.apiUrl).pipe(
          map((response) =>
            HorariosActions.loadHorariosSuccess({ horarios: response.data })
          ),
          catchError((error) =>
            of(
              HorariosActions.loadHorariosFailure({
                error: error.error?.message || 'Error al cargar horarios',
              })
            )
          )
        )
      )
    )
  );

  loadHorariosByUsuario$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HorariosActions.loadHorariosByUsuario),
      switchMap(({ idUsuario }) =>
        this.http.get<{ data: Horario[] }>(`${this.apiUrl}/usuario/${idUsuario}`).pipe(
          map((response) =>
            HorariosActions.loadHorariosByUsuarioSuccess({
              idUsuario,
              horarios: response.data,
            })
          ),
          catchError((error) =>
            of(
              HorariosActions.loadHorariosByUsuarioFailure({
                error: error.error?.message || 'Error al cargar horarios del usuario',
              })
            )
          )
        )
      )
    )
  );

  loadHorario$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HorariosActions.loadHorario),
      switchMap(({ id }) =>
        this.http.get<{ data: Horario }>(`${this.apiUrl}/${id}`).pipe(
          map((response) =>
            HorariosActions.loadHorarioSuccess({ horario: response.data })
          ),
          catchError((error) =>
            of(
              HorariosActions.loadHorarioFailure({
                error: error.error?.message || 'Error al cargar horario',
              })
            )
          )
        )
      )
    )
  );

  createHorario$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HorariosActions.createHorario),
      switchMap(({ horario }) =>
        this.http.post<{ data: Horario }>(this.apiUrl, horario).pipe(
          map((response) =>
            HorariosActions.createHorarioSuccess({ horario: response.data })
          ),
          catchError((error) =>
            of(
              HorariosActions.createHorarioFailure({
                error: error.error?.message || 'Error al crear horario',
              })
            )
          )
        )
      )
    )
  );

  updateHorario$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HorariosActions.updateHorario),
      switchMap(({ id, horario }) =>
        this.http.patch<{ data: Horario }>(`${this.apiUrl}/${id}`, horario).pipe(
          map((response) =>
            HorariosActions.updateHorarioSuccess({ horario: response.data })
          ),
          catchError((error) =>
            of(
              HorariosActions.updateHorarioFailure({
                error: error.error?.message || 'Error al actualizar horario',
              })
            )
          )
        )
      )
    )
  );

  deleteHorario$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HorariosActions.deleteHorario),
      switchMap(({ id }) =>
        this.http.delete(`${this.apiUrl}/${id}`).pipe(
          map(() => HorariosActions.deleteHorarioSuccess({ id })),
          catchError((error) =>
            of(
              HorariosActions.deleteHorarioFailure({
                error: error.error?.message || 'Error al eliminar horario',
              })
            )
          )
        )
      )
    )
  );
}

