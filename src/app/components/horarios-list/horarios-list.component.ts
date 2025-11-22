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
    DividerModule
  ],
  templateUrl: './horarios-list.component.html',
  styleUrl: './horarios-list.component.scss'
})
export class HorariosListComponent implements OnInit {
  horarios: Horario[] = [];
  usuarios: Usuario[] = [];
  asignaturas: Asignatura[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  editingHorario: Horario | null = null;
  horarioForm: FormGroup;
  deletingId: number | null = null;
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
    private fb: FormBuilder
  ) {
    this.horarioForm = this.fb.group({
      dia: ['', Validators.required],
      hora_inicio: ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      hora_fin: ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      id_usuario: ['', [Validators.required, Validators.min(1)]],
      id_asignatura: ['', [Validators.required, Validators.min(1)]]
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
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.handleError(err, 'horarios');
      }
    });
  }

  refresh(): void {
    this.loadData();
  }

  openCreateForm(): void {
    this.editingHorario = null;
    this.horarioForm.reset();
    this.showForm = true;
    this.error = null;
  }

  openEditForm(horario: Horario): void {
    this.editingHorario = horario;
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
    this.horarioForm.reset();
    this.error = null;
  }

  saveHorario(): void {
    if (this.horarioForm.invalid) {
      this.markFormGroupTouched(this.horarioForm);
      return;
    }

    const formValue = this.horarioForm.value;
    // Convertir IDs a números
    formValue.id_usuario = parseInt(formValue.id_usuario, 10);
    formValue.id_asignatura = parseInt(formValue.id_asignatura, 10);
    
    // Validar que hora_fin sea mayor que hora_inicio
    if (formValue.hora_fin <= formValue.hora_inicio) {
      this.error = 'La hora de fin debe ser posterior a la hora de inicio';
      return;
    }

    this.loading = true;
    this.error = null;

    const operation = this.editingHorario
      ? this.horariosService.updateHorario(this.editingHorario.id, formValue)
      : this.horariosService.createHorario(formValue);

    operation.subscribe({
      next: () => {
        this.loadHorarios();
        this.closeForm();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error:', err);
        if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = this.editingHorario 
            ? 'Error al actualizar el horario' 
            : 'Error al crear el horario';
        }
      }
    });
  }

  deleteHorario(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      return;
    }

    this.deletingId = id;
    this.error = null;

    this.horariosService.deleteHorario(id).subscribe({
      next: () => {
        this.loadHorarios();
        this.deletingId = null;
      },
      error: (err) => {
        this.deletingId = null;
        console.error('Error:', err);
        if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Error al eliminar el horario';
        }
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

  private handleError(err: any, tipo: string): void {
    console.error(`Error al cargar ${tipo}:`, err);
    if (err.status === 0) {
      this.error = 'No se puede conectar al backend. Asegúrate de que esté ejecutándose en http://localhost:3000';
    } else if (err.status === 404) {
      this.error = 'Endpoint no encontrado. Verifica que el backend esté configurado correctamente.';
    } else if (err.error?.message) {
      this.error = `Error: ${err.error.message}`;
    } else {
      this.error = `Error al cargar ${tipo}. Verifica la consola para más detalles.`;
    }
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

