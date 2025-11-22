import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';
import { logout } from '../store/auth/auth.actions';
import { selectCurrentUser, selectIsAuthenticated, selectIsAdmin, selectIsEstudiante } from '../store/auth/auth.selectors';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  constructor(private store: Store<AppState>) {}

  getCurrentUser(): Observable<Usuario | null> {
    return this.store.select(selectCurrentUser);
  }

  getCurrentUserValue(): Usuario | null {
    let user: Usuario | null = null;
    this.store.select(selectCurrentUser).subscribe(u => user = u).unsubscribe();
    return user;
  }

  isLoggedIn(): Observable<boolean> {
    return this.store.select(selectIsAuthenticated);
  }

  isAdmin(): Observable<boolean> {
    return this.store.select(selectIsAdmin);
  }

  isEstudiante(): Observable<boolean> {
    return this.store.select(selectIsEstudiante);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}

