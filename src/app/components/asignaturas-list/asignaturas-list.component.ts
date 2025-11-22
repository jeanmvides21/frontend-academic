import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsignaturasService } from '../../services/asignaturas.service';
import { Asignatura } from '../../models/asignatura.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-asignaturas-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    DialogModule,
    SkeletonModule,
    TooltipModule,
    TagModule,
    BadgeModule
  ],
  templateUrl: './asignaturas-list.component.html',
  styleUrl: './asignaturas-list.component.scss'
})
export class AsignaturasListComponent implements OnInit {
  asignaturas: Asignatura[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  editingAsignatura: Asignatura | null = null;
  asignaturaForm: FormGroup;
  deletingId: number | null = null;

  constructor(
    private asignaturasService: AsignaturasService,
    private fb: FormBuilder
  ) {
    this.asignaturaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      maxclasessemana: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    this.loadAsignaturas();
  }

  loadAsignaturas(): void {
    this.loading = true;
    this.error = null;

    this.asignaturasService.getAsignaturas().subscribe({
      next: (data) => {
        this.asignaturas = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error completo:', err);
        
        if (err.status === 0) {
          this.error = 'No se puede conectar al backend. Asegúrate de que esté ejecutándose en http://localhost:3000';
        } else if (err.status === 404) {
          this.error = 'Endpoint no encontrado. Verifica que el backend esté configurado correctamente.';
        } else if (err.error?.message) {
          this.error = `Error: ${err.error.message}`;
        } else {
          this.error = 'Error al cargar las asignaturas. Verifica la consola para más detalles.';
        }
      }
    });
  }

  refresh(): void {
    this.loadAsignaturas();
  }

  openCreateForm(): void {
    this.editingAsignatura = null;
    this.asignaturaForm.reset({ maxclasessemana: 1 });
    this.showForm = true;
    this.error = null;
  }

  openEditForm(asignatura: Asignatura): void {
    this.editingAsignatura = asignatura;
    this.asignaturaForm.patchValue({
      nombre: asignatura.nombre,
      descripcion: asignatura.descripcion || '',
      maxclasessemana: asignatura.maxclasessemana
    });
    this.showForm = true;
    this.error = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingAsignatura = null;
    this.asignaturaForm.reset({ maxclasessemana: 1 });
    this.error = null;
  }

  saveAsignatura(): void {
    if (this.asignaturaForm.invalid) {
      this.markFormGroupTouched(this.asignaturaForm);
      return;
    }

    const formValue = this.asignaturaForm.value;
    // Convertir maxclasessemana a número
    formValue.maxclasessemana = parseInt(formValue.maxclasessemana, 10);
    
    this.loading = true;
    this.error = null;

    const operation = this.editingAsignatura
      ? this.asignaturasService.updateAsignatura(this.editingAsignatura.id, formValue)
      : this.asignaturasService.createAsignatura(formValue);

    operation.subscribe({
      next: () => {
        this.loadAsignaturas();
        this.closeForm();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error:', err);
        if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = this.editingAsignatura 
            ? 'Error al actualizar la asignatura' 
            : 'Error al crear la asignatura';
        }
      }
    });
  }

  deleteAsignatura(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar esta asignatura?')) {
      return;
    }

    this.deletingId = id;
    this.error = null;

    this.asignaturasService.deleteAsignatura(id).subscribe({
      next: () => {
        this.loadAsignaturas();
        this.deletingId = null;
      },
      error: (err) => {
        this.deletingId = null;
        console.error('Error:', err);
        if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Error al eliminar la asignatura';
        }
      }
    });
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

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.asignaturaForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} es requerido`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} debe tener al menos ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      return `${fieldName} no puede tener más de ${field.errors?.['maxlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('min')) {
      return `${fieldName} debe ser al menos ${field.errors?.['min'].min}`;
    }
    if (field?.hasError('max')) {
      return `${fieldName} no puede ser mayor a ${field.errors?.['max'].max}`;
    }
    return '';
  }
}

