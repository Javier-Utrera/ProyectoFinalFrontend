import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // =====================================================================
  // PERFIL
  // =====================================================================

  obtenerPerfil(): Observable<any> {
    return this.http.get(`${this.baseUrl}/perfil/`, {
      headers: this.getHeaders()
    });
  }

  actualizarPerfil(datos: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.patch(`${this.baseUrl}/perfil/`, datos, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // =====================================================================
  // RELATOS
  // =====================================================================

  //Obtener
  getRelatosPublicados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/relatos/publicados/`);
  }

  getMisRelatos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/relatos/`, {
      headers: this.getHeaders()
    });
  }

  //Devuelve los datos completos del relato si el usuario es uno de los autores
  getRelatoPorId(relatoId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/relatos/${relatoId}/`, {
      headers: this.getHeaders()
    });
  }

  //Devuelve los datos completos del relato si el usuario no es uno de los autores y ademas el estado del relato es PUBLICADO
  getRelatoPorIdPublico(relatoId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/relatos/publicados/${relatoId}/`)
  }
  //Devuelve los relatos en estado CREACION con sito libre
  getRelatosAbiertos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/relatos/abiertos/`);
  }

  //Crear
  //datos debe incluir: titulo, descripcion, contenido, idioma, num_escritores
  crearRelato(datos: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/relatos/crear/`, datos, {
      headers: this.getHeaders()
    });
  }

  //Editar
  //Se puede enviar uno o varios de estos campos: titulo, descripcion, contenido, idioma, estado
  editarRelato(relatoId: number, datos: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/relatos/${relatoId}/editar/`, datos, {
      headers: this.getHeaders()
    });
  }

  //Eliminar
  //Solo se puede eliminar si el usuario es autor y no hay mas colaboradores
  eliminarRelato(relatoId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/relatos/${relatoId}/eliminar/`, {
      headers: this.getHeaders()
    });
  }

  //Acciones
  //Me esta dando dolor de cabeza esto, miro si el escritor esta registrado en el relato, si ya le ha dado o no al boton de listo, y entonces compruebo si todo el mundo le ha dado al boton de listo para publicar el relato
  marcarRelatoListo(relatoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/relatos/${relatoId}/marcar-listo/`, {}, {
      headers: this.getHeaders()
    });
  }

  //Devuelve mensaje si el usuario se ha unido con exito o ya participaba
  unirseARelato(relatoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/relatos/${relatoId}/unirse/`, {}, {
      headers: this.getHeaders()
    });
  }

  // =====================================================================
  // AMIGOS
  // =====================================================================

  //Devuelve los amigos del usuario
  getAmigos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/amigos/`, {
      headers: this.getHeaders()
    });
  }

  //Devuelve las solicitudes de amistad recibidas 
  getSolicitudesRecibidas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/amigos/recibidas/`, {
      headers: this.getHeaders()
    });
  }
  //Devuelve las solicitudes de amistad enviadas
  getSolicitudesEnviadas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/amigos/enviadas/`, {
      headers: this.getHeaders()
    });
  }
  //Envia una solicitud de amistad a un usuario usando como parametro su id
  enviarSolicitudAmistad(usuarioId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/amigos/enviar/`, {
      a_usuario: usuarioId
    }, {
      headers: this.getHeaders()
    });
  }
  //Acepta una solicitud de amistad usando como parametro su id
  aceptarSolicitudAmistad(solicitudId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/amigos/aceptar/${solicitudId}/`, {}, {
      headers: this.getHeaders()
    });
  }
  //Rechaza una solicitud de amistad usando como parametro su id
  bloquearSolicitudAmistad(solicitudId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/amigos/bloquear/${solicitudId}/`, {}, {
      headers: this.getHeaders()
    });
  }
  // Obtener lista de usuarios bloqueados
  getUsuariosBloqueados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/amigos/bloqueados/`, {
      headers: this.getHeaders()
    });
  }
  // Desbloquear usuario
  desbloquearUsuario(usuarioId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/amigos/desbloquear/${usuarioId}/`, {
      headers: this.getHeaders()
    });
  }
  //Elimina una solicitud de amistad usando como parametro su id
  eliminarAmigo(usuarioId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/amigos/eliminar/${usuarioId}/`, {
      headers: this.getHeaders()
    });
  }
  // =====================================================================
  // BUSCADOR USUARIOS
  // =====================================================================

  buscarUsuarios(termino: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios/buscar/`, {
      headers: this.getHeaders(),
      params: { q: termino }
    });
  }
}
