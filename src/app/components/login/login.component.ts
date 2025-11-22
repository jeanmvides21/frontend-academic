import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor completa todos los campos correctamente',
        life: 4000
      });
      return;
    }

    this.loading = true;
    const { correo, password } = this.loginForm.value;

    this.authService.login(correo, password).subscribe({
      next: (response: any) => {
        console.log('📦 Respuesta completa del login:', response);
        
        // Extraer usuario de la respuesta (puede venir envuelto en {data: ...})
        const usuario = response?.data || response;
        console.log('👤 Usuario final:', usuario);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Bienvenido',
          detail: `Hola ${usuario.nombre}!`,
          life: 3000
        });

        // Redirigir según el rol
        console.log('🚀 Redirigiendo usuario - Rol:', usuario.rol);
        if (usuario.rol === 'admin') {
          console.log('👨‍💼 Admin - Redirigiendo a /usuarios');
          this.router.navigate(['/usuarios']);
        } else {
          console.log('👨‍🎓 Estudiante - Redirigiendo a /calendario');
          this.router.navigate(['/calendario']);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en login:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error de autenticación',
          detail: err.error?.message || 'Correo o contraseña incorrectos',
          life: 5000
        });
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.hasError('required') && control.touched) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email') && control.touched) {
      return 'Ingresa un correo válido';
    }
    if (control?.hasError('minlength') && control.touched) {
      return 'Mínimo 3 caracteres';
    }
    return '';
  }
}

