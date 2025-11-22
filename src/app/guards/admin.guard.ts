import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AppState } from '../store/app.state';
import { selectIsAuthenticated, selectIsAdmin, selectIsEstudiante } from '../store/auth/auth.selectors';
import { loadUserFromStorage } from '../store/auth/auth.actions';

export const adminGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      store.dispatch(loadUserFromStorage());
    } catch (error) {
      localStorage.removeItem('currentUser');
    }
  }

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            JSON.parse(storedUser);
            store.dispatch(loadUserFromStorage());
            return combineLatest([
              store.select(selectIsAuthenticated),
              store.select(selectIsAdmin),
              store.select(selectIsEstudiante)
            ]).pipe(
              take(1),
              map(([auth, isAdmin, isEstudiante]) => {
                if (auth && isAdmin) {
                  return true;
                }
                if (isEstudiante) {
                  router.navigate(['/calendario']);
                  return false;
                }
                router.navigate(['/login']);
                return false;
              })
            );
          } catch (error) {
            localStorage.removeItem('currentUser');
          }
        }
        router.navigate(['/login']);
        return of(false);
      }

      return combineLatest([
        store.select(selectIsAdmin),
        store.select(selectIsEstudiante)
      ]).pipe(
        take(1),
        map(([isAdmin, isEstudiante]) => {
          if (isAdmin) {
            return true;
          }

          if (isEstudiante) {
            router.navigate(['/calendario']);
            return false;
          }

          router.navigate(['/login']);
          return false;
        })
      );
    })
  );
};

