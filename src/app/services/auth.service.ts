import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Usuario } from '../models/usuario.model';

export interface LoginRequest {
  correo: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUser = signal<Usuario | null>(null);
  private isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Recuperar usuario de localStorage al iniciar
    this.loadUserFromStorage();
  }

  login(correo: string, password: string): Observable<Usuario> {
    return this.http.post<any>(`${this.apiUrl}/login`, { correo, password })
      .pipe(
        tap(response => {
          console.log('📦 Respuesta del backend:', response);
          // El backend envuelve la respuesta en {data: ..., success: ...}
          const usuario = response.data || response;
          console.log('👤 Usuario extraído:', usuario);
          this.setCurrentUser(usuario);
        }),
        catchError(error => {
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  private setCurrentUser(usuario: Usuario): void {
    console.log('🔐 Usuario autenticado:', usuario);
    console.log('👤 Rol del usuario:', usuario.rol);
    this.currentUser.set(usuario);
    this.isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(usuario));
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const usuario = JSON.parse(userStr);
        console.log('📂 Usuario cargado desde localStorage:', usuario);
        this.currentUser.set(usuario);
        this.isAuthenticated.set(true);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  getCurrentUser(): Usuario | null {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    const isAdmin = user?.rol === 'admin';
    console.log('🔍 isAdmin():', isAdmin, '- Usuario:', user?.nombre, '- Rol:', user?.rol);
    return isAdmin;
  }

  isEstudiante(): boolean {
    const user = this.currentUser();
    const isEstudiante = user?.rol === 'estudiante';
    console.log('🔍 isEstudiante():', isEstudiante, '- Usuario:', user?.nombre, '- Rol:', user?.rol);
    return isEstudiante;
  }
}

