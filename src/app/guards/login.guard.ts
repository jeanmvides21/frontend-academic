import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppState } from '../store/app.state';
import { selectIsAuthenticated, selectCurrentUser } from '../store/auth/auth.selectors';
import { loadUserFromStorage } from '../store/auth/auth.actions';

export const loginGuard: CanActivateFn = (route, state) => {
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
      if (isAuthenticated) {
        return store.select(selectCurrentUser).pipe(
          take(1),
          map(user => {
            if (user?.rol === 'admin') {
              router.navigate(['/usuarios']);
            } else {
              router.navigate(['/calendario']);
            }
            return false;
          })
        );
      }
      
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          store.dispatch(loadUserFromStorage());
          if (user.rol === 'admin') {
            router.navigate(['/usuarios']);
          } else {
            router.navigate(['/calendario']);
          }
          return of(false);
        } catch (error) {
          localStorage.removeItem('currentUser');
        }
      }
      
      return of(true);
    })
  );
};

