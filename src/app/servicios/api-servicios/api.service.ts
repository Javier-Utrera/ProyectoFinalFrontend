import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comentario, ComentariosPorSecciones, Estadistica, OpcionesRelato, PaginatedResponse, Relato, Usuario, UsuarioRanking, Voto } from './api.models';
import { shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.baseUrl;
  private readonly swaggerUrl = environment.swaggerUrl;  

  private opcionesCache$?: Observable<OpcionesRelato>;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getUsuarioPorToken(): Observable<Usuario> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token en localStorage');
    }
    return this.http.get<Usuario>(
      `${this.baseUrl}/token/usuario/${token}/`
    );
  }

  // ===========================================================================
  // PERFIL
  // ===========================================================================

  obtenerPerfil(usuarioId?: number): Observable<Usuario> {
    const url = usuarioId
      ? `${this.baseUrl}/perfil/${usuarioId}/`
      : `${this.baseUrl}/perfil/`;
    return this.http.get<Usuario>(url, { headers: this.getHeaders() });
  }

  actualizarPerfil(datos: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/perfil/`, datos, {
      headers: this.getHeaders()
    });
  }

  // ===========================================================================
  // RELATOS
  // ===========================================================================

  /** Opciones de idiomas y géneros para formularios */
  getOpcionesRelato(): Observable<OpcionesRelato> {
    if (!this.opcionesCache$) {
      this.opcionesCache$ = this.http
        .get<OpcionesRelato>(`${this.baseUrl}/opciones-relato/`)
        .pipe(shareReplay(1));
    }
    return this.opcionesCache$;
  }


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

  /* Editar contenido FINAL de un relato (solo Moderador/Admin) */
  editarRelatoFinal(relatoId: number, datos: any): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/moderador/relatos/${relatoId}/editar-final/`,
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

  getComentarios(relatoId: number): Observable<ComentariosPorSecciones> {
    return this.http.get<ComentariosPorSecciones>(
      `${this.baseUrl}/relatos/${relatoId}/comentarios/`,
      { headers: this.getHeaders() }
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
  // VOTOS A COMENTARIOS
  // ===========================================================================

  votarComentario(
    relatoId: number,
    comentarioId: number
  ): Observable<Comentario> {
    return this.http.post<Comentario>(
      `${this.baseUrl}/relatos/${relatoId}/comentarios/${comentarioId}/votar/`,
      {},
      { headers: this.getHeaders() }
    );
  }

  quitarVotoComentario(
    relatoId: number,
    comentarioId: number
  ): Observable<Comentario> {
    return this.http.post<Comentario>(
      `${this.baseUrl}/relatos/${relatoId}/comentarios/${comentarioId}/quitar-voto/`,
      {},
      { headers: this.getHeaders() }
    );
  }

  eliminarVotoComentario(
    relatoId: number,
    comentarioId: number
  ): Observable<Comentario> {
    return this.http.delete<Comentario>(
      `${this.baseUrl}/relatos/${relatoId}/comentarios/${comentarioId}/voto/`,
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

  getRankingUsuarios(
    filtro: 'relatos' | 'votos' | 'palabras'
  ): Observable<UsuarioRanking[]> {
    return this.http.get<UsuarioRanking[]>(
      `${this.baseUrl}/ranking-usuarios/?filtro=${filtro}`
    );
  }

  getSwaggerSpec(): Observable<any> {
    return this.http.get<any>(
      this.swaggerUrl,
      { headers: this.getHeaders() }
    );
  }
}
