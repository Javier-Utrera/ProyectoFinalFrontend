
export interface Comentario {
  id: number;
  usuario: {
    id: number;
    username: string;
    avatar?: string;
  };
  texto: string;
  fecha: string;
  relato: number;
}


export interface Voto {
  id: number;
  usuario: {
    id: number;
    username: string;
  };
  puntuacion: number;
  fecha: string;
  relato: number;
}

export interface Estadistica {
  titulo: string;
  id: number;
  relato: Object;
  num_colaboradores: number;
  num_comentarios: number;
  promedio_votos: number;
  total_palabras: number;
  tiempo_total?: number;
}

export interface Relato {
  id: number;
  titulo: string;
  descripcion: string;
  contenido?: string;
  idioma: string;
  estado: 'CREACION' | 'EN_PROCESO' | 'PUBLICADO';
  fecha_creacion: string;
  num_escritores: number;
  autores: number[];
}

export interface PaginatedResponse<T> {
  count: number;
  next:   string | null;
  previous: string | null;
  results: T[];
}