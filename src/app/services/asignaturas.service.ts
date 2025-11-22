import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Asignatura } from '../models/asignatura.model';

interface ApiResponse<T> {
  data: T;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AsignaturasService {
  private apiUrl = 'http://localhost:3000/api/asignaturas';

  constructor(private http: HttpClient) {}

  getAsignaturas(): Observable<Asignatura[]> {
    return this.http.get<ApiResponse<Asignatura[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getAsignatura(id: number): Observable<Asignatura> {
    return this.http.get<ApiResponse<Asignatura>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createAsignatura(asignatura: Partial<Asignatura>): Observable<Asignatura> {
    return this.http.post<ApiResponse<Asignatura>>(this.apiUrl, asignatura).pipe(
      map(response => response.data)
    );
  }

  updateAsignatura(id: number, asignatura: Partial<Asignatura>): Observable<Asignatura> {
    return this.http.patch<ApiResponse<Asignatura>>(`${this.apiUrl}/${id}`, asignatura).pipe(
      map(response => response.data)
    );
  }

  deleteAsignatura(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined)
    );
  }
}

