# Frontend - Sistema de Gestión Académica

Aplicación web desarrollada con Angular 20 para la gestión de horarios académicos.

## Tecnologías

- Angular 20
- TypeScript 5.x
- PrimeNG 18+
- PrimeFlex
- SCSS
- RxJS

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/           # Componentes de la aplicación
│   │   ├── login/           # Componente de autenticación
│   │   ├── navbar/          # Barra de navegación
│   │   ├── usuarios-list/   # Lista de estudiantes
│   │   ├── asignaturas-list/ # Lista de asignaturas
│   │   ├── horarios-list/   # Lista de horarios
│   │   └── calendario-semanal/ # Calendario semanal
│   │
│   ├── services/            # Servicios HTTP
│   │   ├── auth.service.ts
│   │   ├── usuarios.service.ts
│   │   ├── asignaturas.service.ts
│   │   └── horarios.service.ts
│   │
│   ├── models/              # Interfaces TypeScript
│   │   ├── usuario.model.ts
│   │   ├── asignatura.model.ts
│   │   └── horario.model.ts
│   │
│   ├── guards/              # Guards de rutas
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   │
│   ├── app.routes.ts        # Configuración de rutas
│   └── app.config.ts        # Configuración de la aplicación
│
└── environments/            # Configuración de entornos
    ├── environment.ts
    └── environment.prod.ts
```

## Configuración

### Instalación

```bash
npm install
```

### Ejecución

```bash
# Servidor de desarrollo
npm start

# La aplicación estará disponible en http://localhost:4200
```

### Compilación

```bash
# Compilar para producción
npm run build

# Los archivos compilados estarán en dist/
```

## Rutas de la Aplicación

```
/login                 - Página de inicio de sesión (pública)
/calendario            - Calendario semanal (autenticado)
/usuarios              - Gestión de estudiantes (solo admin)
/asignaturas          - Gestión de asignaturas (solo admin)
/horarios             - Gestión de horarios (solo admin)
```

## Componentes Principales

### LoginComponent
- Formulario de autenticación
- Validación de credenciales
- Redirección según rol de usuario

### NavbarComponent
- Menú de navegación dinámico según rol
- Botón de cerrar sesión
- Responsive con menú móvil

### UsuariosListComponent
- Lista de estudiantes en tarjetas
- Formulario de creación y edición
- Validaciones de formulario
- Confirmación de eliminación

### AsignaturasListComponent
- Lista de asignaturas en tarjetas
- Gestión completa CRUD
- Validación de datos

### HorariosListComponent
- Lista de horarios en tabla
- Validación de conflictos en tiempo real
- Alertas de cruce de horarios

### CalendarioSemanalComponent
- Vista de calendario tipo Google Calendar
- Navegación por semanas
- Selector de estudiante (admin)
- Vista personal (estudiante)

## Servicios

### AuthService
```typescript
login(correo: string, password: string): Observable<Usuario>
logout(): void
getCurrentUser(): Usuario | null
isAdmin(): boolean
isEstudiante(): boolean
```

### UsuariosService
```typescript
getUsuarios(): Observable<Usuario[]>
getUsuario(id: number): Observable<Usuario>
createUsuario(usuario: CreateUsuarioDto): Observable<Usuario>
updateUsuario(id: number, usuario: UpdateUsuarioDto): Observable<Usuario>
deleteUsuario(id: number): Observable<void>
```

### AsignaturasService
```typescript
getAsignaturas(): Observable<Asignatura[]>
getAsignatura(id: number): Observable<Asignatura>
createAsignatura(asignatura: CreateAsignaturaDto): Observable<Asignatura>
updateAsignatura(id: number, asignatura: UpdateAsignaturaDto): Observable<Asignatura>
deleteAsignatura(id: number): Observable<void>
```

### HorariosService
```typescript
getHorarios(): Observable<Horario[]>
getHorario(id: number): Observable<Horario>
createHorario(horario: CreateHorarioDto): Observable<Horario>
updateHorario(id: number, horario: UpdateHorarioDto): Observable<Horario>
deleteHorario(id: number): Observable<void>
```

## Guards

### authGuard
Protege rutas que requieren autenticación. Redirige a /login si no hay sesión activa.

### adminGuard
Protege rutas exclusivas de administrador. Redirige a /calendario si el usuario es estudiante.

## Modelos de Datos

### Usuario
```typescript
interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  correo: string;
  telefono: string;
  rol: 'admin' | 'estudiante';
  password?: string;
  created_at?: string;
  updated_at?: string;
}
```

### Asignatura
```typescript
interface Asignatura {
  id: number;
  nombre: string;
  descripcion?: string;
  maxclasessemana: number;
  created_at?: string;
  updated_at?: string;
}
```

### Horario
```typescript
interface Horario {
  id: number;
  dia: DiaSemana;
  hora_inicio: string;
  hora_fin: string;
  id_usuario: number;
  id_asignatura: number;
  usuario?: Usuario;
  asignatura?: Asignatura;
  created_at?: string;
  updated_at?: string;
}
```

## Estilos

### Variables SCSS Principales
```scss
$primary-color: #6366f1;      // Azul índigo
$secondary-color: #8b5cf6;    // Púrpura
$success-color: #10b981;      // Verde
$danger-color: #ef4444;       // Rojo
$warning-color: #f59e0b;      // Naranja
```

### Tema PrimeNG
Se utiliza el tema Aura de PrimeNG configurado en `app.config.ts`.

## Validaciones de Formularios

### Formulario de Usuario
- Cédula: requerida, 5-20 caracteres
- Nombre: requerido, 2-100 caracteres
- Correo: requerido, formato email válido
- Teléfono: requerido, 7-20 caracteres
- Rol: requerido, valores válidos
- Contraseña: requerida al crear, 6-50 caracteres

### Formulario de Asignatura
- Nombre: requerido, 2-100 caracteres
- Descripción: opcional, máximo 500 caracteres
- Máximo clases por semana: requerido, 1-10

### Formulario de Horario
- Día: requerido
- Hora inicio: requerida, formato HH:mm
- Hora fin: requerida, formato HH:mm
- Usuario: requerido
- Asignatura: requerida

## Notificaciones

Se utiliza el componente Toast de PrimeNG para mostrar notificaciones:

- Success: Operaciones exitosas (verde)
- Error: Errores del servidor (rojo)
- Warning: Advertencias y validaciones (amarillo)
- Info: Información general (azul)

## Persistencia de Sesión

La sesión de usuario se almacena en localStorage para mantener la autenticación entre recargas de página.

## Scripts Disponibles

```bash
npm start          # Servidor de desarrollo
npm run build      # Compilar para producción
npm run test       # Ejecutar pruebas
npm run lint       # Ejecutar linter
```

## Consideraciones de Desarrollo

1. Todos los componentes son standalone
2. Se utiliza programación reactiva con RxJS
3. Los formularios son reactivos (ReactiveFormsModule)
4. Se implementa lazy loading donde sea posible
5. Los estilos son modulares y reutilizables
