import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastModule } from 'primeng/toast';
import { AppState } from './store/app.state';
import { loadUserFromStorage } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // Cargar usuario desde localStorage al iniciar la aplicación
    this.store.dispatch(loadUserFromStorage());
  }
}
