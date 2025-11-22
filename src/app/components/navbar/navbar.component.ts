import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  mobileMenuOpen = false;

  menuItems: MenuItem[] = [
    {
      label: 'Calendario',
      icon: 'pi pi-calendar',
      routerLink: '/calendario'
    },
    {
      label: 'Usuarios',
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

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}

