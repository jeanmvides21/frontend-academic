import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Horario } from '../models/horario.model';

interface ApiResponse<T> {
  data: T;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HorariosService {
  private apiUrl = 'http://localhost:3000/api/horarios';

  constructor(private http: HttpClient) {}

  getHorarios(): Observable<Horario[]> {
    return this.http.get<ApiResponse<Horario[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getHorario(id: number): Observable<Horario> {
    return this.http.get<ApiResponse<Horario>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  getHorariosByUsuario(idUsuario: number): Observable<Horario[]> {
    return this.http.get<ApiResponse<Horario[]>>(`${this.apiUrl}/usuario/${idUsuario}`).pipe(
      map(response => response.data)
    );
  }

  createHorario(horario: Partial<Horario>): Observable<Horario> {
    return this.http.post<ApiResponse<Horario>>(this.apiUrl, horario).pipe(
      map(response => response.data)
    );
  }

  updateHorario(id: number, horario: Partial<Horario>): Observable<Horario> {
    return this.http.patch<ApiResponse<Horario>>(`${this.apiUrl}/${id}`, horario).pipe(
      map(response => response.data)
    );
  }

  deleteHorario(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined)
    );
  }
}

