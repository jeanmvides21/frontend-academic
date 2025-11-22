import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HorariosService } from '../../services/horarios.service';
import { UsuariosService } from '../../services/usuarios.service';
import { AsignaturasService } from '../../services/asignaturas.service';
import { Horario, DiaSemana } from '../../models/horario.model';
import { Usuario } from '../../models/usuario.model';
import { Asignatura } from '../../models/asignatura.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-horarios-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectModule,
    DialogModule,
    SkeletonModule,
    TooltipModule,
    TagModule,
    BadgeModule,
    DividerModule,
    TableModule,
    MultiSelectModule
  ],
  templateUrl: './horarios-list.component.html',
  styleUrl: './horarios-list.component.scss'
})
export class HorariosListComponent implements OnInit {
  horarios: Horario[] = [];
  horariosFiltrados: Horario[] = [];
  usuarios: Usuario[] = [];
  asignaturas: Asignatura[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  editingHorario: Horario | null = null;
  horarioForm: FormGroup;
  deletingId: number | null = null;
  horarioConflicto: Horario | null = null;
  usuarioSeleccionado: number | null = null;
  asignaturasSeleccionadas: number[] = [];
  asignaturasDisponibles: { label: string; value: number }[] = [];
  diasSemana: DiaSemana[] = [
    DiaSemana.LUNES,
    DiaSemana.MARTES,
    DiaSemana.MIERCOLES,
    DiaSemana.JUEVES,
    DiaSemana.VIERNES,
    DiaSemana.SABADO,
    DiaSemana.DOMINGO
  ];

  constructor(
    private horariosService: HorariosService,
    private usuariosService: UsuariosService,
    private asignaturasService: AsignaturasService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.horarioForm = this.fb.group({
      dia: ['', Validators.required],
      hora_inicio: ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      hora_fin: ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      id_usuario: ['', [Validators.required, Validators.min(1)]],
      id_asignatura: ['', [Validators.required, Validators.min(1)]]
    });

    // Escuchar cambios en el formulario para validar cruces en tiempo real
    this.horarioForm.valueChanges.subscribe(() => {
      this.verificarCruce();
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    // Cargar usuarios y asignaturas primero
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data || [];
        this.asignaturasService.getAsignaturas().subscribe({
          next: (asignaturas) => {
            this.asignaturas = asignaturas || [];
            this.loadHorarios();
          },
          error: (err) => {
            this.loading = false;
            this.handleError(err, 'asignaturas');
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.handleError(err, 'usuarios');
      }
    });
  }

  loadHorarios(): void {
    this.horariosService.getHorarios().subscribe({
      next: (data) => {
        this.horarios = data || [];
        this.filtrarHorarios();
        this.actualizarAsignaturasDisponibles();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.handleError(err, 'horarios');
      }
    });
  }

  filtrarHorarios(): void {
    let filtrados = [...this.horarios];

    // Filtro por usuario seleccionado
    if (this.usuarioSeleccionado) {
      filtrados = filtrados.filter(
        horario => horario.id_usuario === this.usuarioSeleccionado
      );
    }

    // Filtro por asignaturas seleccionadas
    if (this.asignaturasSeleccionadas.length > 0) {
      filtrados = filtrados.filter(horario =>
        this.asignaturasSeleccionadas.includes(horario.id_asignatura)
      );
    }

    this.horariosFiltrados = filtrados;
    this.actualizarAsignaturasDisponibles();
  }

  onUsuarioChange(): void {
    this.filtrarHorarios();
    this.actualizarAsignaturasDisponibles();
  }

  onAsignaturasChange(): void {
    this.filtrarHorarios();
  }

  actualizarAsignaturasDisponibles(): void {
    // Obtener asignaturas únicas de los horarios filtrados por usuario
    let horariosParaAsignaturas = this.horarios;
    
    if (this.usuarioSeleccionado) {
      horariosParaAsignaturas = horariosParaAsignaturas.filter(
        h => h.id_usuario === this.usuarioSeleccionado
      );
    }

    // Obtener IDs únicos de asignaturas
    const idsAsignaturas = [...new Set(horariosParaAsignaturas.map(h => h.id_asignatura))];
    
    // Crear opciones de asignaturas disponibles
    this.asignaturasDisponibles = idsAsignaturas
      .map(id => {
        const asignatura = this.asignaturas.find(a => a.id === id);
        return asignatura ? { label: asignatura.nombre, value: asignatura.id } : null;
      })
      .filter((item): item is { label: string; value: number } => item !== null)
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  limpiarFiltros(): void {
    this.usuarioSeleccionado = null;
    this.asignaturasSeleccionadas = [];
    this.filtrarHorarios();
  }

  refresh(): void {
    this.loadData();
  }

  openCreateForm(): void {
    this.editingHorario = null;
    this.horarioForm.reset();
    this.horarioConflicto = null;
    this.showForm = true;
    this.error = null;
  }

  openEditForm(horario: Horario): void {
    this.editingHorario = horario;
    this.horarioConflicto = null;
    this.horarioForm.patchValue({
      dia: horario.dia,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
      id_usuario: horario.id_usuario,
      id_asignatura: horario.id_asignatura
    });
    this.showForm = true;
    this.error = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingHorario = null;
    this.horarioConflicto = null;
    this.horarioForm.reset();
    this.error = null;
  }

  // Verificar si hay cruces con otros horarios
  verificarCruce(): void {
    const formValue = this.horarioForm.value;
    
    // Solo verificar si tenemos todos los datos necesarios
    if (!formValue.id_usuario || !formValue.dia || !formValue.hora_inicio || !formValue.hora_fin) {
      this.horarioConflicto = null;
      return;
    }

    // Filtrar horarios del mismo usuario y día
    const horariosMismoDia = this.horarios.filter(h => 
      h.id_usuario === parseInt(formValue.id_usuario) && 
      h.dia === formValue.dia &&
      (!this.editingHorario || h.id !== this.editingHorario.id) // Excluir el que se está editando
    );

    // Verificar si hay solapamiento
    for (const horario of horariosMismoDia) {
      if (this.checkTimeOverlap(
        formValue.hora_inicio,
        formValue.hora_fin,
        horario.hora_inicio,
        horario.hora_fin
      )) {
        this.horarioConflicto = horario;
        return;
      }
    }

    this.horarioConflicto = null;
  }

  // Función para verificar solapamiento de horarios
  private checkTimeOverlap(
    horaInicio1: string,
    horaFin1: string,
    horaInicio2: string,
    horaFin2: string
  ): boolean {
    const [h1Inicio, m1Inicio] = horaInicio1.split(':').map(Number);
    const [h1Fin, m1Fin] = horaFin1.split(':').map(Number);
    const [h2Inicio, m2Inicio] = horaInicio2.split(':').map(Number);
    const [h2Fin, m2Fin] = horaFin2.split(':').map(Number);

    const inicio1 = h1Inicio * 60 + m1Inicio;
    const fin1 = h1Fin * 60 + m1Fin;
    const inicio2 = h2Inicio * 60 + m2Inicio;
    const fin2 = h2Fin * 60 + m2Fin;

    return inicio1 < fin2 && inicio2 < fin1;
  }

  saveHorario(): void {
    if (this.horarioForm.invalid) {
      this.markFormGroupTouched(this.horarioForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor completa todos los campos requeridos',
        life: 4000
      });
      return;
    }

    const formValue = this.horarioForm.value;
    // Convertir IDs a números
    formValue.id_usuario = parseInt(formValue.id_usuario, 10);
    formValue.id_asignatura = parseInt(formValue.id_asignatura, 10);
    
    // Validar que hora_fin sea mayor que hora_inicio
    if (formValue.hora_fin <= formValue.hora_inicio) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Horario inválido',
        detail: 'La hora de fin debe ser posterior a la hora de inicio',
        life: 4000
      });
      return;
    }

    // Validar que no haya cruces antes de enviar
    if (this.horarioConflicto) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Conflicto de horarios',
        detail: `El horario se cruza con ${this.getAsignaturaNombre(this.horarioConflicto.id_asignatura)}`,
        life: 4000
      });
      return;
    }

    this.loading = true;

    const operation = this.editingHorario
      ? this.horariosService.updateHorario(this.editingHorario.id, formValue)
      : this.horariosService.createHorario(formValue);

    operation.subscribe({
      next: () => {
        this.loadHorarios();
        this.closeForm();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.editingHorario 
            ? 'Horario actualizado correctamente' 
            : 'Horario creado correctamente',
          life: 3000
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error:', err);
        
        let errorDetail = this.editingHorario 
          ? 'Error al actualizar el horario' 
          : 'Error al crear el horario';
        
        if (err.error?.message) {
          errorDetail = err.error.message;
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorDetail,
          life: 5000
        });
      }
    });
  }

  deleteHorario(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      return;
    }

    this.deletingId = id;

    this.horariosService.deleteHorario(id).subscribe({
      next: () => {
        this.loadHorarios();
        this.deletingId = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Horario eliminado correctamente',
          life: 3000
        });
      },
      error: (err) => {
        this.deletingId = null;
        console.error('Error:', err);
        
        let errorDetail = 'Error al eliminar el horario';
        if (err.error?.message) {
          errorDetail = err.error.message;
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorDetail,
          life: 5000
        });
      }
    });
  }

  getUsuarioNombre(id: number): string {
    const usuario = this.usuarios.find(u => u.id === id);
    return usuario ? usuario.nombre : `Usuario #${id}`;
  }

  getAsignaturaNombre(id: number): string {
    const asignatura = this.asignaturas.find(a => a.id === id);
    return asignatura ? asignatura.nombre : `Asignatura #${id}`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getDiaNombre(dia: DiaSemana): string {
    const nombres: { [key: string]: string } = {
      'LUNES': 'Lunes',
      'MARTES': 'Martes',
      'MIERCOLES': 'Miércoles',
      'JUEVES': 'Jueves',
      'VIERNES': 'Viernes',
      'SABADO': 'Sábado',
      'DOMINGO': 'Domingo'
    };
    return nombres[dia] || dia;
  }

  getDiaSeverity(dia: DiaSemana): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null {
    const severityMap: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' } = {
      'LUNES': 'info',
      'MARTES': 'success',
      'MIERCOLES': 'warn',
      'JUEVES': 'danger',
      'VIERNES': 'info',
      'SABADO': 'secondary',
      'DOMINGO': 'secondary'
    };
    return severityMap[dia] || 'info';
  }

  private handleError(err: any, tipo: string): void {
    console.error(`Error al cargar ${tipo}:`, err);
    let errorMsg = `Error al cargar ${tipo}`;
    
    if (err.status === 0) {
      errorMsg = 'No se puede conectar al backend';
    } else if (err.status === 404) {
      errorMsg = 'Endpoint no encontrado';
    } else if (err.error?.message) {
      errorMsg = err.error.message;
    }
    
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMsg,
      life: 5000
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.horarioForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} es requerido`;
    }
    if (field?.hasError('pattern')) {
      return 'Formato inválido. Use HH:MM (24 horas)';
    }
    if (field?.hasError('min')) {
      return 'Seleccione una opción válida';
    }
    return '';
  }
}

