import { Routes } from '@angular/router';
import { UsuariosListComponent } from './components/usuarios-list/usuarios-list.component';
import { AsignaturasListComponent } from './components/asignaturas-list/asignaturas-list.component';
import { HorariosListComponent } from './components/horarios-list/horarios-list.component';
import { CalendarioSemanalComponent } from './components/calendario-semanal/calendario-semanal.component';

export const routes: Routes = [
  { path: '', redirectTo: '/calendario', pathMatch: 'full' },
  { path: 'calendario', component: CalendarioSemanalComponent },
  { path: 'usuarios', component: UsuariosListComponent },
  { path: 'asignaturas', component: AsignaturasListComponent },
  { path: 'horarios', component: HorariosListComponent },
  { path: '**', redirectTo: '/calendario' }
];
