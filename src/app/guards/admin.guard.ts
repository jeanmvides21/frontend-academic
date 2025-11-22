import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppState } from '../store/app.state';
import { selectIsAuthenticated, selectIsAdmin, selectIsEstudiante } from '../store/auth/auth.selectors';

export const adminGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  return combineLatest([
    store.select(selectIsAuthenticated),
    store.select(selectIsAdmin),
    store.select(selectIsEstudiante)
  ]).pipe(
    take(1),
    map(([isAuthenticated, isAdmin, isEstudiante]) => {
      if (isAuthenticated && isAdmin) {
        return true;
      }

      // Si es estudiante, redirigir a su calendario
      if (isEstudiante) {
        router.navigate(['/calendario']);
        return false;
      }

      // Si no está autenticado, redirigir al login
      router.navigate(['/login']);
      return false;
    })
  );
};

