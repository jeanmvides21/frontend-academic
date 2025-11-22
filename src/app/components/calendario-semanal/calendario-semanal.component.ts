import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HorariosService } from '../../services/horarios.service';
import { UsuariosService } from '../../services/usuarios.service';
import { AuthService } from '../../services/auth.service';
import { Horario } from '../../models/horario.model';
import { Usuario } from '../../models/usuario.model';

interface CalendarioEvento {
  horario: Horario;
  dia: string;
  horaInicio: number;
  horaFin: number;
  top: number;
  height: number;
}

@Component({
  selector: 'app-calendario-semanal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    CardModule,
    SkeletonModule,
    TooltipModule
  ],
  templateUrl: './calendario-semanal.component.html',
  styleUrl: './calendario-semanal.component.scss'
})
export class CalendarioSemanalComponent implements OnInit, OnDestroy {
  // Señales de estado
  usuarios = signal<Usuario[]>([]);
  usuarioSeleccionado = signal<number | null>(null);
  horarios = signal<Horario[]>([]);
  loading = signal<boolean>(false);
  private destroy$ = new Subject<void>();
  
  // Configuración del calendario
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  horas: string[] = [];
  horaInicio = 6; // 06:00
  horaFin = 22;   // 22:00
  
  // Navegación de semanas
  semanaActual = new Date();
  
  // Colores pastel para las materias
  coloresPastel = [
    '#FFE5E5', '#E5F5FF', '#E5FFE5', '#FFF5E5', '#FFE5FF',
    '#E5FFFF', '#FFF0E5', '#F0E5FF', '#FFFFE5', '#E5F0FF'
  ];
  
  constructor(
    private horariosService: HorariosService,
    private usuariosService: UsuariosService,
    private messageService: MessageService,
    public authService: AuthService
  ) {
    this.generarHoras();
  }

  ngOnInit() {
    // Si es estudiante, cargar directamente su calendario
    this.authService.isEstudiante()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isEstudiante => {
        if (isEstudiante) {
          const currentUser = this.authService.getCurrentUserValue();
          if (currentUser) {
            this.usuarioSeleccionado.set(currentUser.id);
            this.cargarHorarios();
          }
        } else {
          // Si es admin, cargar todos los usuarios
          this.cargarUsuarios();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Genera el array de horas para el calendario
  generarHoras() {
    this.horas = [];
    for (let i = this.horaInicio; i <= this.horaFin; i++) {
      this.horas.push(`${i.toString().padStart(2, '0')}:00`);
    }
  }

  // Carga todos los usuarios
  cargarUsuarios() {
    this.loading.set(true);
    this.usuariosService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.loading.set(false);
        
        // Seleccionar el primer usuario automáticamente
        if (usuarios.length > 0) {
          this.usuarioSeleccionado.set(usuarios[0].id);
          this.cargarHorarios();
        }
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los estudiantes',
          life: 5000
        });
      }
    });
  }

  // Carga los horarios del usuario seleccionado
  cargarHorarios() {
    const usuarioId = this.usuarioSeleccionado();
    if (!usuarioId) return;

    this.loading.set(true);
    this.horariosService.getHorariosByUsuario(usuarioId).subscribe({
      next: (horarios) => {
        this.horarios.set(horarios);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar horarios:', err);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los horarios',
          life: 5000
        });
      }
    });
  }

  // Evento cuando cambia el usuario seleccionado
  onUsuarioChange() {
    this.cargarHorarios();
  }

  // Obtiene los eventos para un día específico
  obtenerEventosPorDia(dia: string): CalendarioEvento[] {
    return this.horarios()
      .filter(h => h.dia === dia)
      .map(horario => this.convertirHorarioAEvento(horario, dia));
  }

  // Convierte un horario a un evento del calendario con posición
  convertirHorarioAEvento(horario: Horario, dia: string): CalendarioEvento {
    const [horaInicioHoras, horaInicioMinutos] = horario.hora_inicio.split(':').map(Number);
    const [horaFinHoras, horaFinMinutos] = horario.hora_fin.split(':').map(Number);

    const horaInicioDecimal = horaInicioHoras + horaInicioMinutos / 60;
    const horaFinDecimal = horaFinHoras + horaFinMinutos / 60;

    // Calcular posición y altura en porcentaje
    const totalHoras = this.horaFin - this.horaInicio + 1;
    const alturaHora = 60; // píxeles por hora
    
    const top = (horaInicioDecimal - this.horaInicio) * alturaHora;
    const height = (horaFinDecimal - horaInicioDecimal) * alturaHora;

    return {
      horario,
      dia,
      horaInicio: horaInicioDecimal,
      horaFin: horaFinDecimal,
      top,
      height
    };
  }

  // Obtiene un color pastel basado en el id de la asignatura
  obtenerColorAsignatura(idAsignatura: number): string {
    const index = idAsignatura % this.coloresPastel.length;
    return this.coloresPastel[index];
  }

  // Obtiene un color de borde más oscuro basado en el color de fondo
  obtenerColorBorde(colorFondo: string): string {
    // Convertir hex a RGB y oscurecer
    const r = parseInt(colorFondo.slice(1, 3), 16);
    const g = parseInt(colorFondo.slice(3, 5), 16);
    const b = parseInt(colorFondo.slice(5, 7), 16);
    
    const factor = 0.7;
    const nr = Math.floor(r * factor);
    const ng = Math.floor(g * factor);
    const nb = Math.floor(b * factor);
    
    return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
  }

  // Navegación: Semana anterior
  semanaAnterior() {
    const nueva = new Date(this.semanaActual);
    nueva.setDate(nueva.getDate() - 7);
    this.semanaActual = nueva;
  }

  // Navegación: Esta semana
  estaSemana() {
    this.semanaActual = new Date();
  }

  // Navegación: Siguiente semana
  siguienteSemana() {
    const nueva = new Date(this.semanaActual);
    nueva.setDate(nueva.getDate() + 7);
    this.semanaActual = nueva;
  }

  // Formatea el rango de la semana actual
  obtenerRangoSemana(): string {
    const inicio = this.obtenerLunesSemana(this.semanaActual);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 6);
    
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return `${inicio.toLocaleDateString('es-ES', opciones)} - ${fin.toLocaleDateString('es-ES', opciones)}`;
  }

  // Obtiene el lunes de la semana de una fecha
  obtenerLunesSemana(fecha: Date): Date {
    const dia = fecha.getDay();
    const diff = fecha.getDate() - dia + (dia === 0 ? -6 : 1);
    return new Date(fecha.setDate(diff));
  }

  // Formatea la hora para mostrar
  formatearHora(hora: string): string {
    return hora;
  }

  // Formatea el texto del evento
  obtenerTextoEvento(evento: CalendarioEvento): string {
    const nombreAsignatura = evento.horario.asignatura?.nombre || 'Sin asignatura';
    const horaInicio = evento.horario.hora_inicio.substring(0, 5);
    const horaFin = evento.horario.hora_fin.substring(0, 5);
    return `${nombreAsignatura}\n${horaInicio} - ${horaFin}`;
  }

  // Obtiene el nombre corto del día
  obtenerDiaCorto(dia: string): string {
    const dias: { [key: string]: string } = {
      'Lunes': 'LUN',
      'Martes': 'MAR',
      'Miércoles': 'MIÉ',
      'Jueves': 'JUE',
      'Viernes': 'VIE',
      'Sábado': 'SÁB',
      'Domingo': 'DOM'
    };
    return dias[dia] || dia;
  }
}

