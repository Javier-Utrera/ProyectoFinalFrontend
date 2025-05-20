// Comentario individual
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
  votos: number;
  mi_voto: number;
}

// Al listar desde el servidor separo en dos bloques
export interface ComentariosPorSecciones {
  amigos: Comentario[];
  otros: Comentario[];
}

// Usuario para perfil / listados
export interface Usuario {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
  biografia?: string;
  fecha_nacimiento?: string;
  pais?: string;
  ciudad?: string;
  generos_favoritos?: string;
  total_relatos_publicados?: number; 
  total_votos_recibidos?: number;
  total_palabras_escritas?: number;
  rol?: number;
  rol_nombre?: string;
}

// Mi voto sobre relato
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

// Estadísticas generales de un relato
export interface Estadistica {
  id: number;
  titulo: string;
  relato: object;
  num_colaboradores: number;
  num_comentarios: number;
  promedio_votos: number;
  total_palabras: number;
  tiempo_total?: number;
}

export interface UsuarioRanking {
  id: number;
  username: string;
  avatar_url: string;
  total_relatos_publicados: number;
  total_votos_recibidos: number;
  total_palabras_escritas: number;
}

// Modelo principal de un relato
export interface Relato {
  id: number;
  titulo: string;
  descripcion: string;
  contenido?: string;
  idioma: string;
  idioma_display: string;
  generos:string;
  generos_display:string;
  estado: 'CREACION' | 'EN_PROCESO' | 'PUBLICADO';
  fecha_creacion: string;
  num_escritores: number;
  autores: number[];
  participaciones: ParticipacionRelato[]; 
}

export interface ParticipacionRelato {
  usuario: number;
  orden: number;
}

export interface OpcionesRelato {
  idiomas: [string, string][];
  generos: [string, string][];
}

// Paginación genérica
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
