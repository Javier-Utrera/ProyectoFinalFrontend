import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../api-servicios/api.models';

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

  constructor(private http: HttpClient) {
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

  registrarUsuario(data: any): Observable<any> {
    return this.http.post<{ access_token: string; user: Usuario }>(
      `${this.baseUrl}/registro/`, data
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        this.estadoAutenticacion.next(true);
        // Subimos a memoria el user que nos devuelve el login
        this.currentUserSubject.next(res.user);
      })
    );
  }

  loginUsuario(data: any): Observable<any> {
    return this.http.post<{ access_token: string; user: Usuario }>(
      `${this.baseUrl}/login/`, data
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        this.estadoAutenticacion.next(true);
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logoutUsuario(): Observable<any> {
    const token = this.obtenerToken() || '';
    return this.http.post(
      `${this.baseUrl}/logout/`, {},
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    ).pipe(
      tap(() => this.cerrarSesion())
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
}
