import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AppState } from '../../store/app.state';
import { login, clearAuthError } from '../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError, selectCurrentUser } from '../../store/auth/auth.selectors';

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
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
    
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  ngOnInit(): void {
    // Limpiar errores al iniciar
    this.store.dispatch(clearAuthError());

    // Escuchar cambios en el usuario (para redirección después del login)
    this.store.select(selectCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.messageService.add({
            severity: 'success',
            summary: 'Bienvenido',
            detail: `Hola ${user.nombre}!`,
            life: 3000
          });
        }
      });

    // Escuchar errores
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de autenticación',
            detail: error,
            life: 5000
          });
          this.store.dispatch(clearAuthError());
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

    const { correo, password } = this.loginForm.value;
    this.store.dispatch(login({ correo, password }));
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

