import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

interface ApiResponse<T> {
  data: T;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<ApiResponse<Usuario[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<ApiResponse<Usuario>>(this.apiUrl, usuario).pipe(
      map(response => response.data)
    );
  }

  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.patch<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`, usuario).pipe(
      map(response => response.data)
    );
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined)
    );
  }
}

