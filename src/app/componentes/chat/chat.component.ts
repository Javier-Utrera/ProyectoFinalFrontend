import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ApiTiempoRealService } from '../../servicios/api-tiempo-real/api-tiempo-real.service';
import { DatePipe, CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { Usuario } from '../../servicios/api-servicios/api.models';
import { environment } from '../../../environments/environment';

interface Mensaje {
  id: number;
  autor: string;
  texto: string;
  fecha_envio: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() relatoId!: number;

  private readonly baseUrl = environment.baseUrl;

  mensajes: Mensaje[] = [];
  mensajeControl = new FormControl('');
  usuarioActual: string = '';

  private mensajeSub!: Subscription;
  private authSub!: Subscription;

  constructor(
    private http: HttpClient,
    private chatService: ApiTiempoRealService,
    private ngZone: NgZone,
    private authService: AutenticacionService
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.currentUser$.subscribe((user: Usuario | null) => {
      if (user) {
        this.usuarioActual = user.username ?? '';
      } else {
        this.usuarioActual = '';
      }
    });

    if (!this.relatoId) {
      console.error('ChatComponent: no se recibió relatoId por @Input');
      return;
    }

    this.cargarHistorial();

    // 2) Conectar WebSocket y suscribirse a mensajes nuevos
    this.chatService.connect(this.relatoId);
    this.mensajeSub = this.chatService.mensajes$.subscribe((nuevoMsg: Mensaje) => {
      this.ngZone.run(() => {
        this.mensajes.push(nuevoMsg);
        this.scrollAlFinal();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.mensajeSub) {
      this.mensajeSub.unsubscribe();
    }
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    this.chatService.disconnect();
  }

  private cargarHistorial(): void {
    const url = `${this.baseUrl}/relatos/${this.relatoId}/mensajes/`;
    const token = this.authService.obtenerToken() || '';

    this.http.get<Mensaje[]>(url, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (results) => {
        this.mensajes = results;
        this.scrollAlFinal();
      },
      error: (err) => {
        console.error('Error cargando historial:', err);
      }
    });
  }

  enviar(): void {
    const texto = this.mensajeControl.value?.trim();
    if (texto) {
      this.chatService.sendMessage(texto);
      this.mensajeControl.reset();
    }
  }

  private scrollAlFinal(): void {
    setTimeout(() => {
      const cont = document.getElementById('contenedor-mensajes');
      if (cont) {
        cont.scrollTop = cont.scrollHeight;
      }
    }, 50);
  }
}
