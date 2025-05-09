
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
  id: number;
  relato: number;
  num_colaboradores: number;
  num_comentarios: number;
  promedio_votos: number;
  total_palabras: number;
  tiempo_total?: number;
}
  