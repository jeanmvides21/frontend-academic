import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '../store/app.state';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};

