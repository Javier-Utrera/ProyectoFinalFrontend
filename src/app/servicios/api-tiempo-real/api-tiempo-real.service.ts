// src/app/services/api-tiempo-real.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MensajeGlobalService } from '../mensaje-global/mensaje-global.service';

@Injectable({
  providedIn: 'root'
})
export class ApiTiempoRealService {
  private socket!: WebSocket;
  private mensajesSubject = new Subject<any>();
  public mensajes$ = this.mensajesSubject.asObservable();
  private readonly wsBaseUrl = environment.wsBaseUrl;

  constructor(
    private ngZone: NgZone,
    private msj: MensajeGlobalService       
  ) { }

  public connect(relatoId: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.msj.mostrar('No estás autenticado. Por favor, inicia sesión.', 'warning');
      return;
    }

    const url = `${this.wsBaseUrl}/chat/${relatoId}/?token=${token}`;
    this.socket = new WebSocket(url);

    // this.socket.onopen = () => {
    //   this.msj.mostrar('Conexión de chat establecida', 'info');
    // };

    this.socket.onmessage = (event) => {
      this.ngZone.run(() => {
        try {
          const data = JSON.parse(event.data);
          this.mensajesSubject.next(data);
        } catch (err) {
          this.msj.mostrar('Error al interpretar mensaje del servidor.', 'danger');
        }
      });
    };

    this.socket.onerror = (err) => {
      this.ngZone.run(() => {
        this.msj.mostrar('Se ha producido un error en la conexión de tiempo real.', 'danger');
      });
    };

    // this.socket.onclose = (ev) => {
    //   this.ngZone.run(() => {
    //     this.msj.mostrar('Conexión de chat cerrada.', 'info');
    //   });
    // };
  }

  public sendMessage(texto: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const payload = { texto };
      this.socket.send(JSON.stringify(payload));
    } else {
      this.msj.mostrar('No puedes enviar mensajes: conexión no establecida.', 'warning');
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
