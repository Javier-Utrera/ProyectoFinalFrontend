import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../api-servicios/api.models';
import { MensajeGlobalService } from '../mensaje-global/mensaje-global.service';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private readonly baseUrl = environment.baseUrl;

  // Solo el token vive en localStorage
  private estadoAutenticacion = new BehaviorSubject<boolean>(this.hayToken());
  estado$ = this.estadoAutenticacion.asObservable();

  // El objeto user queda solo en memoria
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private msj: MensajeGlobalService) {
    if (this.hayToken()) {
      this.loadUserFromToken();
    }
  }

  private hayToken(): boolean {
    return !!localStorage.getItem('token');
  }

  public obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  public get isAuthenticated(): boolean {
    return !!this.obtenerToken();
  }

  private loadUserFromToken() {
    const token = this.obtenerToken();
    if (!token) {
      this.cerrarSesion();
      return;
    }
    this.http.get<Usuario>(`${this.baseUrl}/token/usuario/${token}/`).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(() => {
        this.cerrarSesion();
        return of(null);
      })
    ).subscribe();
  }

  /** Muestra toast de éxito usando el tipo que venga o 'success' por defecto */
  private handleSuccess<T>() {
    return tap((resp: any) => {
      if (resp?.mensaje) {
        const tipo = (resp.tipo as 'success' | 'warning' | 'info' | 'danger') ?? 'success';
        this.msj.mostrar(resp.mensaje, tipo);
      }
    }) as (obs: Observable<T>) => Observable<T>;
  }

  /** Captura errores del backend concadenando 'error' y 'details' */
  private handleErrorAuth<T>() {
    return catchError((err: any) => {
      const main = err.error?.error || 'Error de comunicación';
      this.msj.mostrar(main, 'danger');
      return throwError(() => err);
    }) as (obs: Observable<T>) => Observable<T>;
  }


  registrarUsuario(data: any): Observable<any> {
    return this.http
      .post<{ access_token: string; user: Usuario }>(
        `${this.baseUrl}/registro/`,
        data
      )
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.access_token);
          this.estadoAutenticacion.next(true);
          this.currentUserSubject.next(res.user);
        }),
        this.handleSuccess(),
        this.handleErrorAuth()
      );
  }

  loginUsuario(data: any): Observable<any> {
    return this.http
      .post<{ access_token: string; user: Usuario }>(
        `${this.baseUrl}/login/`,
        data
      )
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.access_token);
          this.estadoAutenticacion.next(true);
          this.currentUserSubject.next(res.user);
        }),
        this.handleSuccess(),
        this.handleErrorAuth()
      );
  }

  logoutUsuario(): Observable<any> {
    const token = this.obtenerToken() ?? '';
    return this.http
      .post(`${this.baseUrl}/logout/`, {}, { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) })
      .pipe(
        tap(() => {
          this.cerrarSesion();
        }),
        this.handleSuccess(),
        this.handleErrorAuth()
      );
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.estadoAutenticacion.next(false);
    this.currentUserSubject.next(null);
  }

  /** Retorna el usuario actual (en memoria) */
  get currentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /** Comprueba si el usuario tiene alguno de los roles indicados */
  hasRole(...roles: number[]): boolean {
    const role = this.currentUser?.rol ?? 0;
    return roles.includes(role);
  }

  loginWithGoogle(idToken: string): Observable<any> {
    return this.http
      .post<{ access_token: string; user: Usuario }>(
        `${this.baseUrl}/auth/google-login/`,
        { id_token: idToken }
      )
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.access_token);
          this.estadoAutenticacion.next(true);
          this.currentUserSubject.next(res.user);
        }),
        this.handleSuccess(),
        this.handleErrorAuth()
      );
  }
}
