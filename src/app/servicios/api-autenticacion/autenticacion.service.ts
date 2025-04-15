import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private readonly baseUrl = 'http://localhost:8000/api';
  private estadoAutenticacion = new BehaviorSubject<boolean>(this.hayToken());

  estado$: Observable<boolean> = this.estadoAutenticacion.asObservable();

  constructor(private http: HttpClient) { }

  private hayToken(): boolean {
    return !!localStorage.getItem('token');
  }

  registrarUsuario(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registro/`, data).pipe(
      tap((res: any) => {
        if (res.access_token) {
          localStorage.setItem('token', res.access_token);
          this.estadoAutenticacion.next(true);
        }
      })
    );
  }

  loginUsuario(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, data).pipe(
      tap((res: any) => {
        if (res.access_token) {
          localStorage.setItem('token', res.access_token);
          this.estadoAutenticacion.next(true);
        }
      })
    );
  }

  logoutUsuario(): Observable<any> {
    const token = this.obtenerToken();

    return this.http.post(
      `${this.baseUrl}/logout/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).pipe(
      tap(() => {
        this.cerrarSesion();
      })
    );
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.estadoAutenticacion.next(false);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }
}