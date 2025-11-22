import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  // Si es estudiante, redirigir a su calendario
  if (authService.isEstudiante()) {
    router.navigate(['/calendario']);
    return false;
  }

  // Si no está autenticado, redirigir al login
  router.navigate(['/login']);
  return false;
};

