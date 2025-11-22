import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { usuariosReducer } from './store/usuarios/usuarios.reducer';
import { asignaturasReducer } from './store/asignaturas/asignaturas.reducer';
import { horariosReducer } from './store/horarios/horarios.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { UsuariosEffects } from './store/usuarios/usuarios.effects';
import { AsignaturasEffects } from './store/asignaturas/asignaturas.effects';
import { HorariosEffects } from './store/horarios/horarios.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    // NgRx Store Configuration
    provideStore({
      auth: authReducer,
      usuarios: usuariosReducer,
      asignaturas: asignaturasReducer,
      horarios: horariosReducer,
    }),
    provideEffects([
      AuthEffects,
      UsuariosEffects,
      AsignaturasEffects,
      HorariosEffects,
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ]
};
