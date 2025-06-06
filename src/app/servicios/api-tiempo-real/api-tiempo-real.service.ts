// src/app/services/chat.service.ts

import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiTiempoRealService {
  private socket!: WebSocket;
  private mensajesSubject = new Subject<any>();
  private readonly wsBaseUrl = environment.wsBaseUrl;

  // Observable que exponen los mensajes entrantes
  public mensajes$ = this.mensajesSubject.asObservable();

  constructor(private ngZone: NgZone) { }

  /**
   * Abre la conexión WebSocket al chat de un relato.
   * @param relatoId  ID del relato que va en la URL /ws/chat/<relatoId>/
   */
  public connect(relatoId: number): void {
    // 1) Sacamos el token de localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token en localStorage');
      return;
    }

    // 2) Construimos la URL con query string ?token=<valor>
    const url = `${this.wsBaseUrl}/chat/${relatoId}/?token=${token}`;
    this.socket = new WebSocket(url);

    // 3) Definimos el handler de mensajes entrantes
    this.socket.onmessage = (event) => {
      // Siempre que recibamos algo, entramos en el NgZone para que Angular detecte cambios
      this.ngZone.run(() => {
        try {
          const data = JSON.parse(event.data);
          this.mensajesSubject.next(data);
        } catch (err) {
          console.error('No se pudo parsear el mensaje:', err);
        }
      });
    };

    this.socket.onopen = () => {
      console.log('ChatService: conexión abierta');
    };
    this.socket.onerror = (err) => {
      console.error('ChatService: error en WebSocket', err);
    };
    this.socket.onclose = (ev) => {
      console.log('ChatService: conexión cerrada', ev);
    };
  }

  /**
   * Envía un mensaje de texto al servidor.
   * @param texto  Cadena con el contenido del mensaje
   */
  public sendMessage(texto: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const payload = { texto };
      this.socket.send(JSON.stringify(payload));
    } else {
      console.warn('ChatService: socket no está abierto');
    }
  }

  /**
   * Cierra la conexión WebSocket (si está abierta).
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
