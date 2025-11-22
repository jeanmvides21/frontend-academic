import { Component, OnInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule, TooltipModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, DoCheck {
  mobileMenuOpen = false;
  menuItems: MenuItem[] = [];

  constructor(public authService: AuthService) {
    // Actualizar menú cuando el usuario cambie
    console.log('🏗️ NavbarComponent constructor');
  }

  ngOnInit() {
    console.log('📋 NavbarComponent ngOnInit - Usuario actual:', this.authService.getCurrentUser());
    this.updateMenuItems();
  }

  ngDoCheck() {
    // Verificar si el usuario cambió y actualizar el menú
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.menuItems.length === 0) {
      console.log('🔄 Usuario detectado, actualizando menú...');
      this.updateMenuItems();
    }
  }

  updateMenuItems() {
    const currentUser = this.authService.getCurrentUser();
    console.log('🔄 Actualizando menú - Usuario:', currentUser?.nombre, '- Rol:', currentUser?.rol);
    
    if (this.authService.isAdmin()) {
      console.log('✅ Usuario es ADMIN - Mostrando menú completo');
      // Admin ve todo
      this.menuItems = [
        {
          label: 'Calendario',
          icon: 'pi pi-calendar',
          routerLink: '/calendario'
        },
        {
          label: 'Estudiantes',
          icon: 'pi pi-users',
          routerLink: '/usuarios'
        },
        {
          label: 'Asignaturas',
          icon: 'pi pi-book',
          routerLink: '/asignaturas'
        },
        {
          label: 'Horarios',
          icon: 'pi pi-calendar-clock',
          routerLink: '/horarios'
        }
      ];
    } else if (this.authService.isEstudiante()) {
      console.log('✅ Usuario es ESTUDIANTE - Mostrando solo calendario');
      // Estudiante solo ve calendario
      this.menuItems = [
        {
          label: 'Mi Calendario',
          icon: 'pi pi-calendar',
          routerLink: '/calendario'
        }
      ];
    }
  }

  logout() {
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  get currentUserName(): string {
    return this.authService.getCurrentUser()?.nombre || 'Usuario';
  }

  get userRole(): string {
    const user = this.authService.getCurrentUser();
    return user?.rol === 'admin' ? 'Administrador' : 'Estudiante';
  }
}

