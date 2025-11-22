# 📅 Calendario Semanal Component

Un componente Angular moderno tipo Google Calendar con diseño profesional, conectado a Supabase a través del backend NestJS.

## ✨ Características

### Vista del Calendario
- **Vista semanal completa**: Lunes a Domingo
- **Rango horario**: 06:00 - 22:00
- **Eventos posicionados dinámicamente**: Basados en hora_inicio y hora_fin
- **Diseño responsive**: Adaptado para desktop, tablet y móvil

### Funcionalidades
- ✅ Selector de usuario con dropdown
- ✅ Navegación entre semanas (anterior, actual, siguiente)
- ✅ Visualización del rango de fechas actual
- ✅ Eventos con colores pastel por asignatura
- ✅ Tooltips informativos en cada evento
- ✅ Animaciones suaves al cargar y hover
- ✅ Estado de carga con skeleton
- ✅ Estado vacío cuando no hay datos

### Diseño
- 🎨 Colores pastel modernos
- 🔘 Bordes redondeados
- 🌈 Gradientes sutiles en headers
- ✨ Sombras suaves
- 🎭 Animaciones smooth
- 📱 Totalmente responsive

## 🛠 Tecnologías

- **Angular 20** (standalone components)
- **PrimeNG 20** (versión 2025)
- **SCSS** para estilos
- **Signals** para state management
- **RxJS** para manejo de datos asíncronos

## 📦 Instalación

El componente ya está integrado en el proyecto. Solo necesitas:

1. Asegurarte de que el backend esté corriendo:
```bash
cd backend-academic
npm run start:dev
```

2. Iniciar el frontend:
```bash
cd frontend-academic
npm start
```

3. Navegar a: `http://localhost:4200/calendario`

## 🔌 Conexión con Supabase

El componente obtiene datos de la tabla `schedules` en Supabase a través de la API NestJS:

### Estructura de la tabla horarios
```sql
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  dia VARCHAR(20) NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  id_usuario INTEGER NOT NULL REFERENCES usuario(id),
  id_asignatura INTEGER NOT NULL REFERENCES asignatura(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Endpoints utilizados
- `GET /api/usuarios` - Lista de usuarios
- `GET /api/horarios/usuario/:id` - Horarios de un usuario específico

## 📋 Uso

### Navegación
1. **Seleccionar usuario**: Usa el dropdown superior para elegir el usuario
2. **Navegar semanas**: Usa los botones de navegación para moverte entre semanas
3. **Ver detalles**: Haz hover sobre un evento para ver información completa

### Integración en rutas
El componente está configurado como ruta principal:

```typescript
// app.routes.ts
{ path: 'calendario', component: CalendarioSemanalComponent }
```

## 🎨 Personalización

### Cambiar colores de eventos
Edita el array `coloresPastel` en el componente:

```typescript
coloresPastel = [
  '#FFE5E5', // Rosa pastel
  '#E5F5FF', // Azul pastel
  '#E5FFE5', // Verde pastel
  // ... más colores
];
```

### Cambiar rango de horas
Modifica las propiedades en el componente:

```typescript
horaInicio = 6;  // Hora de inicio (24h format)
horaFin = 22;    // Hora de fin (24h format)
```

### Estilos personalizados
Los estilos están en `calendario-semanal.component.scss`:

```scss
// Variables principales
$primary-color: #6366f1;
$secondary-color: #8b5cf6;
$border-radius: 12px;
```

## 🧩 Estructura del Componente

### Archivos
```
calendario-semanal/
├── calendario-semanal.component.ts     # Lógica del componente
├── calendario-semanal.component.html   # Template
└── calendario-semanal.component.scss   # Estilos
```

### Interfaces principales
```typescript
interface CalendarioEvento {
  horario: Horario;
  dia: string;
  horaInicio: number;
  horaFin: number;
  top: number;      // Posición vertical en píxeles
  height: number;   // Altura en píxeles
}
```

### Signals principales
```typescript
usuarios = signal<Usuario[]>([]);
usuarioSeleccionado = signal<number | null>(null);
horarios = signal<Horario[]>([]);
loading = signal<boolean>(false);
```

## 📱 Responsive Design

### Desktop (> 1024px)
- Grid completo con 7 columnas de días
- Columna de horas de 80px
- Eventos con detalles completos

### Tablet (768px - 1024px)
- Grid adaptado con scroll horizontal
- Columna de horas reducida a 60px
- Texto ligeramente más pequeño

### Mobile (< 768px)
- Scroll horizontal optimizado
- Columna de horas de 50px
- Eventos compactos
- Controles reorganizados verticalmente

## 🎯 Funciones principales

### Carga de datos
```typescript
cargarUsuarios()           // Obtiene lista de usuarios
cargarHorarios()          // Obtiene horarios del usuario seleccionado
onUsuarioChange()         // Recarga horarios al cambiar usuario
```

### Renderizado de eventos
```typescript
obtenerEventosPorDia(dia)           // Filtra eventos por día
convertirHorarioAEvento(horario)    // Calcula posición y tamaño
obtenerColorAsignatura(id)          // Asigna color a asignatura
```

### Navegación
```typescript
semanaAnterior()    // Retrocede una semana
estaSemana()        // Vuelve a la semana actual
siguienteSemana()   // Avanza una semana
```

## 🐛 Debugging

### Problema: No se muestran eventos
1. Verifica que el backend esté corriendo
2. Comprueba la consola del navegador para errores
3. Verifica que haya datos en Supabase

### Problema: Eventos mal posicionados
- Revisa que los horarios en la BD tengan formato TIME correcto
- Verifica que `hora_fin > hora_inicio`

### Problema: Colores no se muestran
- Asegúrate de que los eventos tengan `id_asignatura` válido
- Verifica que los colores pastel estén en formato hexadecimal

## 🚀 Próximas mejoras sugeridas

- [ ] Añadir edición de eventos con drag & drop
- [ ] Crear/eliminar eventos desde el calendario
- [ ] Vista mensual adicional
- [ ] Exportar calendario a PDF
- [ ] Filtros por asignatura
- [ ] Vista de conflictos de horarios
- [ ] Sincronización con Google Calendar
- [ ] Modo oscuro

## 📄 Licencia

Este componente es parte del proyecto de Gestión Académica.

---

**Desarrollado con ❤️ usando Angular y PrimeNG**

