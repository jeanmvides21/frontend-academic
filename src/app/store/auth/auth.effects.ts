import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private apiUrl = 'http://localhost:3000/api/auth';
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ correo, password }) =>
        this.http.post<any>(`${this.apiUrl}/login`, { correo, password }).pipe(
          map((response) => {
            const usuario = response.data || response;
            // Guardar en localStorage
            localStorage.setItem('currentUser', JSON.stringify(usuario));
            return AuthActions.loginSuccess({ user: usuario });
          }),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error.error?.message || 'Error al iniciar sesión',
              })
            )
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
          // Redirigir según el rol
          if (user.rol === 'admin') {
            this.router.navigate(['/usuarios']);
          } else {
            this.router.navigate(['/calendario']);
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('currentUser');
          this.router.navigate(['/login']);
        }),
        map(() => AuthActions.logoutSuccess())
      )
  );

  loadUserFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserFromStorage),
      map(() => {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
          try {
            const user: Usuario = JSON.parse(userStr);
            return AuthActions.loadUserFromStorageSuccess({ user });
          } catch (error) {
            localStorage.removeItem('currentUser');
            return AuthActions.logoutSuccess();
          }
        }
        return AuthActions.logoutSuccess();
      })
    )
  );
}

