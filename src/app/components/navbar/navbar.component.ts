import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../store/app.state';
import { selectCurrentUser, selectIsAdmin, selectIsEstudiante } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule, TooltipModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  menuItems$: Observable<MenuItem[]>;
  currentUser$: Observable<any>;
  currentUserName$: Observable<string>;
  userRole$: Observable<string>;
  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private store: Store<AppState>
  ) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.currentUserName$ = this.currentUser$.pipe(
      map(user => user?.nombre || 'Usuario')
    );
    this.userRole$ = this.currentUser$.pipe(
      map(user => user?.rol === 'admin' ? 'Administrador' : 'Estudiante')
    );

    // Crear menú basado en el rol del usuario
    this.menuItems$ = combineLatest([
      this.store.select(selectIsAdmin),
      this.store.select(selectIsEstudiante)
    ]).pipe(
      map(([isAdmin, isEstudiante]) => {
        if (isAdmin) {
          return [
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
        } else if (isEstudiante) {
          return [
            {
              label: 'Mi Calendario',
              icon: 'pi pi-calendar',
              routerLink: '/calendario'
            }
          ];
        }
        return [];
      })
    );
  }

  ngOnInit() {
    // Suscripción para mantener el menú actualizado
    this.menuItems$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}

