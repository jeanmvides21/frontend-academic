# Frontend Angular - Gestión de Usuarios

Frontend desarrollado con Angular para la gestión de usuarios, asignaturas y horarios.

## Características

- ✅ Lista de usuarios con diseño moderno y responsivo
- ✅ Integración con backend NestJS
- ✅ Manejo de estados de carga y errores
- ✅ Interfaz de usuario intuitiva

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Backend NestJS ejecutándose en `http://localhost:3000`

## Instalación

Las dependencias ya están instaladas. Si necesitas reinstalarlas:

```bash
npm install
```

## Ejecutar la Aplicación

### Modo desarrollo:
```bash
npm start
```

O usando Angular CLI:
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## Configuración del Backend

Asegúrate de que el backend esté ejecutándose en `http://localhost:3000/api`.

Si el backend está en una URL diferente, actualiza la URL en:
- `src/app/services/usuarios.service.ts` (línea 9)

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   └── usuarios-list/     # Componente de lista de usuarios
│   ├── models/
│   │   └── usuario.model.ts   # Interfaz del modelo Usuario
│   ├── services/
│   │   └── usuarios.service.ts # Servicio para comunicación con API
│   ├── app.routes.ts          # Configuración de rutas
│   └── app.config.ts          # Configuración de la aplicación
└── styles.css                 # Estilos globales
```

## Funcionalidades Implementadas

### Lista de Usuarios
- Visualización de todos los usuarios en formato de tarjetas
- Información mostrada:
  - Nombre
  - Correo electrónico
  - Teléfono (si está disponible)
  - Fecha de creación
- Botón de actualizar para recargar la lista
- Estados de carga y manejo de errores

## Próximas Funcionalidades

- Crear nuevo usuario
- Editar usuario existente
- Eliminar usuario
- Lista de asignaturas
- Lista de horarios
- Filtros y búsqueda

## Tecnologías Utilizadas

- **Angular 20**: Framework de frontend
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **HTTP Client**: Comunicación con API REST

## Desarrollo

### Generar un nuevo componente:
```bash
ng generate component nombre-componente
```

### Generar un nuevo servicio:
```bash
ng generate service nombre-servicio
```

## Notas

- El frontend está configurado para conectarse al backend en `http://localhost:3000/api`
- Asegúrate de que CORS esté habilitado en el backend
- El diseño es responsivo y se adapta a diferentes tamaños de pantalla
