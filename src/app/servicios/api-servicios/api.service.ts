import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

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
}
