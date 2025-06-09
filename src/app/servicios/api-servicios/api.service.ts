// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Comentario,
  ComentariosPorSecciones,
  DashboardStats,
  Estadistica,
  OpcionesRelato,
  PaginatedResponse,
  Relato,
  Usuario,
  UsuarioRanking,
  Voto
} from './api.models';
import { MensajeGlobalService } from '../mensaje-global/mensaje-global.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.baseUrl;
  private readonly swaggerUrl = environment.swaggerUrl;

  private opcionesCache$?: Observable<OpcionesRelato>;

  constructor(
    private http: HttpClient,
    private msj: MensajeGlobalService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /** Maneja mensajes de éxito */
  private handleSuccess<T>() {
    return tap((resp: any) => {
      if (resp?.mensaje) {
        // Usa el tipo que venga del backend, o 'success' por defecto
        const tipo = (resp.tipo as 'success' | 'warning' | 'info' | 'danger') ?? 'success';
        this.msj.mostrar(resp.mensaje, tipo);
      }
    }) as (source: Observable<T>) => Observable<T>;
  }

  /** Captura errores y muestra alerta */
  private handleError<T>() {
    return catchError((err: any) => {
      const msg =
        err.error?.error ||
        Object.values(err.error || {})
          .flat()
          .find((v: any) => typeof v === 'string') ||
        'Error de comunicación';
      this.msj.mostrar(msg, 'danger');
      return throwError(() => err);
    }) as (source: Observable<T>) => Observable<T>;
  }

  // ===========================================================================
  // PERFIL
  // ===========================================================================

  getUsuarioPorToken(): Observable<Usuario> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token en localStorage');
    }
    return this.http
      .get<Usuario>(`${this.baseUrl}/token/usuario/${token}/`)
      .pipe(this.handleError());
  }

  obtenerPerfil(usuarioId?: number): Observable<Usuario> {
    const url = usuarioId
      ? `${this.baseUrl}/perfil/${usuarioId}/`
      : `${this.baseUrl}/perfil/`;
    return this.http
      .get<Usuario>(url, { headers: this.getHeaders() })
      .pipe(this.handleError());
  }

  actualizarPerfil(datos: any): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}/perfil/`, datos, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  // ===========================================================================
  // RELATOS
  // ===========================================================================

  getOpcionesRelato(): Observable<OpcionesRelato> {
    if (!this.opcionesCache$) {
      this.opcionesCache$ = this.http
        .get<OpcionesRelato>(`${this.baseUrl}/opciones-relato/`)
        .pipe(shareReplay(1), this.handleError());
    }
    return this.opcionesCache$;
  }

  getRelatosPublicados(params?: any): Observable<PaginatedResponse<Relato>> {
    return this.http
      .get<PaginatedResponse<Relato>>(`${this.baseUrl}/relatos/publicados/`, { params })
      .pipe(this.handleError());
  }

  getRelatosDisponibles(params?: any): Observable<PaginatedResponse<Relato>> {
    return this.http
      .get<PaginatedResponse<Relato>>(`${this.baseUrl}/relatos/disponibles/`, {
        params,
        headers: this.getHeaders()
      })
      .pipe(this.handleError());
  }

  getMisRelatos(params?: any): Observable<PaginatedResponse<Relato>> {
    return this.http
      .get<PaginatedResponse<Relato>>(`${this.baseUrl}/relatos/mis-relatos/`, {
        params,
        headers: this.getHeaders()
      })
      .pipe(this.handleError());
  }

  getRelatoPorId(relatoId: number): Observable<Relato> {
    return this.http
      .get<Relato>(`${this.baseUrl}/relatos/${relatoId}/`, { headers: this.getHeaders() })
      .pipe(this.handleError());
  }

  getRelatoPorIdPublico(relatoId: number): Observable<Relato> {
    return this.http
      .get<Relato>(`${this.baseUrl}/relatos/publicados/${relatoId}/`)
      .pipe(this.handleError());
  }

  crearRelato(datos: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/relatos/crear/`, datos, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  editarRelato(relatoId: number, datos: any): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}/relatos/${relatoId}/editar/`, datos, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  editarRelatoFinal(relatoId: number, datos: any): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}/moderador/relatos/${relatoId}/editar-final/`, datos, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  eliminarRelato(relatoId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.baseUrl}/relatos/${relatoId}/eliminar/`, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  marcarRelatoListo(relatoId: number): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/relatos/${relatoId}/marcar-listo/`, {}, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  unirseARelato(relatoId: number): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/relatos/${relatoId}/unirse/`, {}, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  getMiFragmento(relatoId: number): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/relatos/${relatoId}/mi-fragmento/`, { headers: this.getHeaders() })
      .pipe(this.handleError());
  }

  updateMiFragmento(relatoId: number, html: string, silencioso = false): Observable<any> {
    const req$ = this.http.put<any>(
      `${this.baseUrl}/relatos/${relatoId}/mi-fragmento/`,
      { contenido_fragmento: html },
      { headers: this.getHeaders() }
    );
  
    if (silencioso) {
      return req$.pipe(this.handleError());
    }
  
    return req$.pipe(
      tap(() => {
        this.msj.mostrar('Borrador guardado correctamente.', 'info');
      }),
      this.handleError()
    );
  }

  markFragmentReady(relatoId: number): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/relatos/${relatoId}/mi-fragmento/ready/`, {}, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  // ===========================================================================
  // AMIGOS
  // ===========================================================================

  getAmigos(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/amigos/`, { headers: this.getHeaders() })
      .pipe(this.handleError());
  }

  getSolicitudesRecibidas(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/amigos/recibidas/`, { headers: this.getHeaders() })
      .pipe(this.handleError());
  }

  getSolicitudesEnviadas(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/amigos/enviadas/`, { headers: this.getHeaders() })
      .pipe(this.handleError());
  }

  enviarSolicitudAmistad(usuarioId: number): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/amigos/enviar/`, { a_usuario: usuarioId }, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  aceptarSolicitudAmistad(solicitudId: number): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/amigos/aceptar/${solicitudId}/`, {}, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  bloquearSolicitudAmistad(solicitudId: number): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/amigos/bloquear/${solicitudId}/`, {}, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  getUsuariosBloqueados(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/amigos/bloqueados/`, { headers: this.getHeaders() })
      .pipe(this.handleError());
  }

  desbloquearUsuario(usuarioId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.baseUrl}/amigos/desbloquear/${usuarioId}/`, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  eliminarAmigo(usuarioId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.baseUrl}/amigos/eliminar/${usuarioId}/`, { headers: this.getHeaders() })
      .pipe(this.handleSuccess(), this.handleError());
  }

  // ===========================================================================
  // BUSCADOR USUARIOS
  // ===========================================================================

  buscarUsuarios(termino: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/usuarios/buscar/`, {
        headers: this.getHeaders(),
        params: { q: termino }
      })
      .pipe(this.handleError());
  }

  // ===========================================================================
  // COMENTARIOS
  // ===========================================================================

  getComentarios(relatoId: number): Observable<ComentariosPorSecciones> {
    return this.http
      .get<ComentariosPorSecciones>(`${this.baseUrl}/relatos/${relatoId}/comentarios/`, {
        headers: this.getHeaders()
      })
      .pipe(this.handleError());
  }

  crearComentario(relatoId: number, texto: string): Observable<Comentario> {
    return this.http
      .post<Comentario>(
        `${this.baseUrl}/relatos/${relatoId}/comentarios/crear/`,
        { texto },
        { headers: this.getHeaders() }
      )
      .pipe(this.handleSuccess(), this.handleError());
  }

  editarComentario(relatoId: number, comentarioId: number, texto: string): Observable<Comentario> {
    return this.http
      .patch<Comentario>(
        `${this.baseUrl}/relatos/${relatoId}/comentarios/${comentarioId}/editar/`,
        { texto },
        { headers: this.getHeaders() }
      )
      .pipe(this.handleSuccess(), this.handleError());
  }

  borrarComentario(relatoId: number, comentarioId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.baseUrl}/relatos/${relatoId}/comentarios/${comentarioId}/borrar/`, {
        headers: this.getHeaders()
      })
      .pipe(this.handleSuccess(), this.handleError());
  }

  // ===========================================================================
  // VOTOS A COMENTARIOS
  // ===========================================================================

  votarComentario(relatoId: number, comentarioId: number): Observable<Comentario> {
    return this.http
      .post<Comentario>(
        `${this.baseUrl}/relatos/${relatoId}/comentarios/${comentarioId}/votar/`,
        {},
        { headers: this.getHeaders() }
      )
      .pipe(this.handleSuccess(), this.handleError());
  }

  quitarVotoComentario(relatoId: number, comentarioId: number): Observable<Comentario> {
    return this.http
      .post<Comentario>(
        `${this.baseUrl}/relatos/${relatoId}/comentarios/${comentarioId}/quitar-voto/`,
        {},
        { headers: this.getHeaders() }
      )
      .pipe(this.handleSuccess(), this.handleError());
  }

  eliminarVotoComentario(relatoId: number, comentarioId: number): Observable<Comentario> {
    return this.http
      .delete<Comentario>(`${this.baseUrl}/relatos/${relatoId}/comentarios/${comentarioId}/voto/`, {
        headers: this.getHeaders()
      })
      .pipe(this.handleSuccess(), this.handleError());
  }

  // ===========================================================================
  // VOTOS
  // ===========================================================================

  getMiVoto(relatoId: number): Observable<Voto> {
    return this.http
      .get<Voto>(`${this.baseUrl}/relatos/${relatoId}/mi-voto/`, { headers: this.getHeaders() })
      .pipe(this.handleError());
  }

  votarRelato(relatoId: number, puntuacion: number): Observable<Voto> {
    return this.http
      .post<Voto>(
        `${this.baseUrl}/relatos/${relatoId}/votar/`,
        { puntuacion },
        { headers: this.getHeaders() }
      )
      .pipe(this.handleSuccess(), this.handleError());
  }

  // ===========================================================================
  // ESTADÍSTICAS
  // ===========================================================================

  getEstadisticasRelato(relatoId: number): Observable<Estadistica> {
    return this.http
      .get<Estadistica>(`${this.baseUrl}/estadisticas/relatos/${relatoId}/`)
  }

  getEstadisticasRelatoSilent(relatoId: number): Observable<Estadistica> {
    const url = `${this.baseUrl}/estadisticas/relatos/${relatoId}/`;
    return this.http.get<Estadistica>(url);
  }


  getListadoEstadisticas(): Observable<Estadistica[]> {
    return this.http
      .get<Estadistica[]>(`${this.baseUrl}/estadisticas/`)
      .pipe(this.handleError());
  }

  getRankingUsuarios(filtro: 'relatos' | 'votos' | 'palabras'): Observable<UsuarioRanking[]> {
    return this.http
      .get<UsuarioRanking[]>(`${this.baseUrl}/ranking-usuarios/?filtro=${filtro}`)
      .pipe(this.handleError());
  }

  getSwaggerSpec(): Observable<any> {
    return this.http
      .get<any>(this.swaggerUrl, { headers: this.getHeaders() })
      .pipe(this.handleError());
  }

  // ===========================================================================
  // PAYPAL (SUSCRIPCIÓN PREMIUM)
  // ===========================================================================

  crearOrdenPaypal(): Observable<{ orderID: string; status: string; links: any[] }> {
    return this.http
      .post<{ orderID: string; status: string; links: any[] }>(
        `${this.baseUrl}/paypal/crear-orden/`,
        {},
        { headers: this.getHeaders() }
      )
      .pipe(this.handleSuccess(), this.handleError());
  }

  capturarYCrearSuscripcion(data: { orderID: string }): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/paypal/capturar-y-suscribirse/`, data, {
        headers: this.getHeaders()
      })
      .pipe(this.handleSuccess(), this.handleError());
  }

  // ===========================================================================
  // ADMINISTRADOR
  // ===========================================================================

  /** Métricas generales para el dashboard de admin */
  getDashboardStats(): Observable<DashboardStats> {
    return this.http
      .get<DashboardStats>(`${this.baseUrl}/admin/dashboard/`, {
        headers: this.getHeaders()
      })
      .pipe(this.handleError());
  }

}
