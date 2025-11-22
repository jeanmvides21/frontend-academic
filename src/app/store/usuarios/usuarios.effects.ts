import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import * as UsuariosActions from './usuarios.actions';

@Injectable()
export class UsuariosEffects {
  private apiUrl = 'http://localhost:3000/api/usuarios';
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadUsuarios$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsuariosActions.loadUsuarios),
      switchMap(() =>
        this.http.get<{ data: Usuario[] }>(this.apiUrl).pipe(
          map((response) =>
            UsuariosActions.loadUsuariosSuccess({ usuarios: response.data })
          ),
          catchError((error) =>
            of(
              UsuariosActions.loadUsuariosFailure({
                error: error.error?.message || 'Error al cargar usuarios',
              })
            )
          )
        )
      )
    )
  );

  loadUsuario$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsuariosActions.loadUsuario),
      switchMap(({ id }) =>
        this.http.get<{ data: Usuario }>(`${this.apiUrl}/${id}`).pipe(
          map((response) =>
            UsuariosActions.loadUsuarioSuccess({ usuario: response.data })
          ),
          catchError((error) =>
            of(
              UsuariosActions.loadUsuarioFailure({
                error: error.error?.message || 'Error al cargar usuario',
              })
            )
          )
        )
      )
    )
  );

  createUsuario$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsuariosActions.createUsuario),
      switchMap(({ usuario }) =>
        this.http.post<{ data: Usuario }>(this.apiUrl, usuario).pipe(
          map((response) =>
            UsuariosActions.createUsuarioSuccess({ usuario: response.data })
          ),
          catchError((error) =>
            of(
              UsuariosActions.createUsuarioFailure({
                error: error.error?.message || 'Error al crear usuario',
              })
            )
          )
        )
      )
    )
  );

  updateUsuario$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsuariosActions.updateUsuario),
      switchMap(({ id, usuario }) =>
        this.http.patch<{ data: Usuario }>(`${this.apiUrl}/${id}`, usuario).pipe(
          map((response) =>
            UsuariosActions.updateUsuarioSuccess({ usuario: response.data })
          ),
          catchError((error) =>
            of(
              UsuariosActions.updateUsuarioFailure({
                error: error.error?.message || 'Error al actualizar usuario',
              })
            )
          )
        )
      )
    )
  );

  deleteUsuario$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsuariosActions.deleteUsuario),
      switchMap(({ id }) =>
        this.http.delete(`${this.apiUrl}/${id}`).pipe(
          map(() => UsuariosActions.deleteUsuarioSuccess({ id })),
          catchError((error) =>
            of(
              UsuariosActions.deleteUsuarioFailure({
                error: error.error?.message || 'Error al eliminar usuario',
              })
            )
          )
        )
      )
    )
  );
}

