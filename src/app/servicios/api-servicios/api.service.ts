import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comentario, Estadistica, PaginatedResponse, Relato, Voto } from './api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ===========================================================================
  // PERFIL
  // ===========================================================================

  obtenerPerfil(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/perfil/`, {
      headers: this.getHeaders()
    });
  }

  actualizarPerfil(datos: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/perfil/`, datos, {
      headers: this.getHeaders()
    });
  }

  // ===========================================================================
  // RELATOS
  // ===========================================================================

  /** Relatos publicados (público). */
  getRelatosPublicados(params?: any): Observable<PaginatedResponse<Relato>> {
    return this.http.get<PaginatedResponse<Relato>>(
      `${this.baseUrl}/relatos/publicados/`,
      { params }
    );
  }

  /** Relatos disponibles (autenticado). */
  getRelatosDisponibles(params?: any): Observable<PaginatedResponse<Relato>> {
    return this.http.get<PaginatedResponse<Relato>>(
      `${this.baseUrl}/relatos/disponibles/`,
      { params, headers: this.getHeaders() }
    );
  }

  /** Mis relatos (autenticado). */
  getMisRelatos(params?: any): Observable<PaginatedResponse<Relato>> {
    return this.http.get<PaginatedResponse<Relato>>(
      `${this.baseUrl}/relatos/mis-relatos/`,
      { params, headers: this.getHeaders() }
    );
  }

  /** Detalle de relato propio (autenticado). */
  getRelatoPorId(relatoId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/relatos/${relatoId}/`,
      { headers: this.getHeaders() }
    );
  }

  /** Detalle de relato público. */
  getRelatoPorIdPublico(relatoId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/relatos/publicados/${relatoId}/`
    );
  }

  /** Crear relato. */
  crearRelato(datos: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/relatos/crear/`,
      datos,
      { headers: this.getHeaders() }
    );
  }

  /** Editar relato. */
  editarRelato(relatoId: number, datos: any): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/relatos/${relatoId}/editar/`,
      datos,
      { headers: this.getHeaders() }
    );
  }

  /** Eliminar relato. */
  eliminarRelato(relatoId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/relatos/${relatoId}/eliminar/`,
      { headers: this.getHeaders() }
    );
  }

  /** Marcar relato listo. */
  marcarRelatoListo(relatoId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/relatos/${relatoId}/marcar-listo/`,
      {},
      { headers: this.getHeaders() }
    );
  }

  /** Unirse a relato. */
  unirseARelato(relatoId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/relatos/${relatoId}/unirse/`,
      {},
      { headers: this.getHeaders() }
    );
  }

  /** Obtener mi fragmento. */
  getMiFragmento(relatoId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/relatos/${relatoId}/mi-fragmento/`,
      { headers: this.getHeaders() }
    );
  }

  /** Actualizar mi fragmento. */
  updateMiFragmento(relatoId: number, html: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/relatos/${relatoId}/mi-fragmento/`,
      { contenido_fragmento: html },
      { headers: this.getHeaders() }
    );
  }

  /** Marcar fragmento como listo. */
  markFragmentReady(relatoId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/relatos/${relatoId}/mi-fragmento/ready/`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // ===========================================================================
  // AMIGOS
  // ===========================================================================

  getAmigos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/amigos/`, {
      headers: this.getHeaders()
    });
  }

  getSolicitudesRecibidas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/amigos/recibidas/`, {
      headers: this.getHeaders()
    });
  }

  getSolicitudesEnviadas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/amigos/enviadas/`, {
      headers: this.getHeaders()
    });
  }

  enviarSolicitudAmistad(usuarioId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/amigos/enviar/`,
      { a_usuario: usuarioId },
      { headers: this.getHeaders() }
    );
  }

  aceptarSolicitudAmistad(solicitudId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/amigos/aceptar/${solicitudId}/`,
      {},
      { headers: this.getHeaders() }
    );
  }

  bloquearSolicitudAmistad(solicitudId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/amigos/bloquear/${solicitudId}/`,
      {},
      { headers: this.getHeaders() }
    );
  }

  getUsuariosBloqueados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/amigos/bloqueados/`, {
      headers: this.getHeaders()
    });
  }

  desbloquearUsuario(usuarioId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/amigos/desbloquear/${usuarioId}/`,
      { headers: this.getHeaders() }
    );
  }

  eliminarAmigo(usuarioId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/amigos/eliminar/${usuarioId}/`,
      { headers: this.getHeaders() }
    );
  }

  // ===========================================================================
  // BUSCADOR USUARIOS
  // ===========================================================================

  buscarUsuarios(termino: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios/buscar/`, {
      headers: this.getHeaders(),
      params: { q: termino }
    });
  }

  // ===========================================================================
  // COMENTARIOS
  // ===========================================================================

  getComentarios(relatoId: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(
      `${this.baseUrl}/relatos/${relatoId}/comentarios/`
    );
  }

  crearComentario(relatoId: number, texto: string): Observable<Comentario> {
    return this.http.post<Comentario>(
      `${this.baseUrl}/relatos/${relatoId}/comentarios/crear/`,
      { texto },
      { headers: this.getHeaders() }
    );
  }

  editarComentario(
    relatoId: number,
    comentarioId: number,
    texto: string
  ): Observable<Comentario> {
    return this.http.patch<Comentario>(
      `${this.baseUrl}/relatos/${relatoId}/comentarios/${comentarioId}/editar/`,
      { texto },
      { headers: this.getHeaders() }
    );
  }

  borrarComentario(relatoId: number, comentarioId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/relatos/${relatoId}/comentarios/${comentarioId}/borrar/`,
      { headers: this.getHeaders() }
    );
  }

  // ===========================================================================
  // VOTOS
  // ===========================================================================

  getMiVoto(relatoId: number): Observable<Voto> {
    return this.http.get<Voto>(
      `${this.baseUrl}/relatos/${relatoId}/mi-voto/`,
      { headers: this.getHeaders() }
    );
  }

  votarRelato(relatoId: number, puntuacion: number): Observable<Voto> {
    return this.http.post<Voto>(
      `${this.baseUrl}/relatos/${relatoId}/votar/`,
      { puntuacion },
      { headers: this.getHeaders() }
    );
  }

  // =====================================================================
  // ESTADÍSTICAS
  // =====================================================================

  getEstadisticasRelato(relatoId: number): Observable<Estadistica> {
    return this.http.get<Estadistica>(
      `${this.baseUrl}/estadisticas/relatos/${relatoId}/`
    );
  }

  getListadoEstadisticas(): Observable<Estadistica[]> {
    return this.http.get<Estadistica[]>(
      `${this.baseUrl}/estadisticas/`
    );
  }


}
