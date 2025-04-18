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
  //PERFIL
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
  //RELATO
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
  //Me esta dando dolor de cabeza esto, miro si el escritor esta registrado en el relato, si ya le ha dado o no al boton de listo, y entonces compruebo si todo el mundo le ha dado al boton de listo para publicar el relato
  marcarRelatoListo(relatoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/relatos/${relatoId}/marcar-listo/`, {}, {
      headers: this.getHeaders()
    });
  }
  //Devuelve los relatos en estado CREACION con sito libre
  getRelatosAbiertos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/relatos/abiertos/`);
  }
  //Devuelve mensaje si el usuario se ha unido con exito o ya participaba
  unirseARelato(relatoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/relatos/${relatoId}/unirse/`, {}, {
      headers: this.getHeaders()
    });
  }
}
