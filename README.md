# Frontend - Sistema de Gestión Académica

Aplicación web desarrollada con Angular 20 para la gestión de horarios académicos.

## Requisitos Previos

Se requiere tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene incluido con Node.js)

## Instalación

1. Abrir una terminal en la carpeta `frontend-academic`

2. Instalar las dependencias del proyecto:
```bash
npm install
```

Este comando descargará e instalará todas las librerías necesarias (Angular, PrimeNG, TailwindCSS, NgRx, etc.)


## Configuración

Las URLs de la API están configuradas directamente en los servicios y effects. Por defecto, todas apuntan a:

- **Backend URL:** `http://localhost:3000/api`

Las URLs están definidas en:
- `src/app/services/auth.service.ts` - `http://localhost:3000/api/auth`
- `src/app/services/usuarios.service.ts` - `http://localhost:3000/api/usuarios`
- `src/app/services/asignaturas.service.ts` - `http://localhost:3000/api/asignaturas`
- `src/app/services/horarios.service.ts` - `http://localhost:3000/api/horarios`
- `src/app/store/*/effects.ts` - URLs correspondientes para cada módulo

Si se necesita cambiar la URL del backend, modificar directamente en estos archivos.

**Importante:** Asegurarse de que el backend esté corriendo en el puerto 3000 antes de iniciar el frontend (ver README del backend)

## Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm start
```

La aplicación estará disponible en: **http://localhost:4200**


## Compilación para Producción

Para generar los archivos optimizados para producción:

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/frontend-app/`

## Estructura del Proyecto

```
frontend-academic/
├── src/
│   ├── app/
│   │   ├── components/        # Componentes standalone
│   │   │   ├── login/        # Componente de autenticación
│   │   │   ├── navbar/       # Barra de navegación
│   │   │   ├── usuarios-list/    # CRUD de estudiantes
│   │   │   ├── asignaturas-list/ # CRUD de asignaturas
│   │   │   ├── horarios-list/    # CRUD de horarios
│   │   │   └── calendario-semanal/ # Vista calendario
│   │   ├── services/          # Servicios HTTP (URLs hardcodeadas)
│   │   │   ├── auth.service.ts
│   │   │   ├── usuarios.service.ts
│   │   │   ├── asignaturas.service.ts
│   │   │   └── horarios.service.ts
│   │   ├── store/            # Gestión de estado (NgRx)
│   │   │   ├── auth/         # Estado de autenticación
│   │   │   ├── usuarios/     # Estado de usuarios
│   │   │   ├── asignaturas/  # Estado de asignaturas
│   │   │   ├── horarios/     # Estado de horarios
│   │   │   └── app.state.ts  # Estado raíz
│   │   ├── guards/           # Protección de rutas
│   │   │   ├── auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   ├── models/           # Interfaces TypeScript
│   │   │   ├── usuario.model.ts
│   │   │   ├── asignatura.model.ts
│   │   │   └── horario.model.ts
│   │   ├── app.config.ts     # Configuración de la app (NgRx, PrimeNG)
│   │   ├── app.routes.ts     # Configuración de rutas
│   │   └── app.ts            # Componente raíz
│   ├── styles.css            # Estilos globales + TailwindCSS
│   └── main.ts               # Bootstrap
├── tailwind.config.js        # Configuración de TailwindCSS
├── postcss.config.js         # Configuración de PostCSS
├── package.json
└── README.md
```

## Rutas de la Aplicación

- `/login` - Página de inicio de sesión
- `/calendario` - Vista de calendario semanal
- `/usuarios` - Gestión de estudiantes (solo admin)
- `/asignaturas` - Gestión de asignaturas (solo admin)
- `/horarios` - Gestión de horarios (solo admin)

## Credenciales de Acceso

### Administrador
- **Correo:** `admin@admin.com`
- **Contraseña:** `admin123`

### Estudiantes
Para los estudiantes, el correo es el mismo que está registrado en la base de datos y la contraseña es:
- **Contraseña:** `password123`

Ejemplos de estudiantes de prueba:
- `juan.perez@correo.com` / `password123`
- `maria.lopez@correo.com` / `password123`
- `carlos.martinez@correo.com` / `password123`

## Solución de Problemas

### Error: "Cannot find module"
Ejecutar nuevamente `npm install` para reinstalar las dependencias.

### Error: "Port 4200 is already in use"
Cerrar otras aplicaciones que estén usando el puerto 4200, o cambiar el puerto en `angular.json`.

### La aplicación no se conecta al backend
Verificar que:
1. El backend esté corriendo en `http://localhost:3000`
2. Las URLs en los servicios (`src/app/services/*.service.ts`) y effects (`src/app/store/*/effects.ts`) apunten correctamente al backend
3. No haya problemas de CORS (el backend debe permitir requests desde `http://localhost:4200`)

## Tecnologías Utilizadas

- Angular 20.3.0
- TypeScript 5.9.2
- PrimeNG 20.3.0
- TailwindCSS 3.4.18
- NgRx 20.1.0
- RxJS 7.8.0
