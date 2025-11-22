import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    ButtonModule,
    CardModule,
    InputTextModule,
    DialogModule,
    SkeletonModule,
    TooltipModule,
    TagModule
  ],
  templateUrl: './usuarios-list.component.html',
  styleUrl: './usuarios-list.component.scss'
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  editingUsuario: Usuario | null = null;
  usuarioForm: FormGroup;
  deletingId: number | null = null;

  constructor(
    private usuariosService: UsuariosService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.usuarioForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.minLength(7), Validators.maxLength(20)]]
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.error = null;

    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data || [];
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
          this.error = 'Error al cargar los usuarios. Verifica la consola para más detalles.';
        }
      }
    });
  }

  refresh(): void {
    this.loadUsuarios();
  }

  openCreateForm(): void {
    this.editingUsuario = null;
    this.usuarioForm.reset();
    this.showForm = true;
    this.error = null;
  }

  openEditForm(usuario: Usuario): void {
    this.editingUsuario = usuario;
    this.usuarioForm.patchValue({
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono || ''
    });
    this.showForm = true;
    this.error = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingUsuario = null;
    this.usuarioForm.reset();
    this.error = null;
  }

  saveUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.markFormGroupTouched(this.usuarioForm);
      return;
    }

    const formValue = this.usuarioForm.value;
    this.loading = true;
    this.error = null;

    const operation = this.editingUsuario
      ? this.usuariosService.updateUsuario(this.editingUsuario.id, formValue)
      : this.usuariosService.createUsuario(formValue);

    operation.subscribe({
      next: () => {
        this.loadUsuarios();
        this.closeForm();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.editingUsuario 
            ? 'Estudiante actualizado correctamente' 
            : 'Estudiante creado correctamente',
          life: 3000
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error:', err);
        
        let errorDetail = this.editingUsuario 
          ? 'Error al actualizar el estudiante' 
          : 'Error al crear el estudiante';
        
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

  deleteUsuario(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      return;
    }

    this.deletingId = id;
    this.error = null;

    this.usuariosService.deleteUsuario(id).subscribe({
      next: () => {
        this.loadUsuarios();
        this.deletingId = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Estudiante eliminado correctamente',
          life: 3000
        });
      },
      error: (err) => {
        this.deletingId = null;
        console.error('Error:', err);
        
        let errorDetail = 'Error al eliminar el estudiante';
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
    const field = this.usuarioForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} es requerido`;
    }
    if (field?.hasError('email')) {
      return 'Correo electrónico inválido';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} debe tener al menos ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      return `${fieldName} no puede tener más de ${field.errors?.['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}

