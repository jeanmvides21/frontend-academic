export interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  correo: string;
  telefono?: string;
  rol: 'admin' | 'estudiante';
  password?: string; // Solo para creación/actualización
  created_at?: string;
  updated_at?: string;
}

