import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UsuariosListComponent } from './components/usuarios-list/usuarios-list.component';
import { AsignaturasListComponent } from './components/asignaturas-list/asignaturas-list.component';
import { HorariosListComponent } from './components/horarios-list/horarios-list.component';
import { CalendarioSemanalComponent } from './components/calendario-semanal/calendario-semanal.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'calendario', 
    component: CalendarioSemanalComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'usuarios', 
    component: UsuariosListComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'asignaturas', 
    component: AsignaturasListComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'horarios', 
    component: HorariosListComponent,
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: '/login' }
];
