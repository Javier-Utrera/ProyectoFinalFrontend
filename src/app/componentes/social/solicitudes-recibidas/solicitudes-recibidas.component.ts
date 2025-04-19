import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-solicitudes-recibidas',
  imports: [],
  templateUrl: './solicitudes-recibidas.component.html',
  styleUrl: './solicitudes-recibidas.component.css'
})
export class SolicitudesRecibidasComponent implements OnInit {
  solicitudes: any[] = [];
  cargando = true;

  constructor(private apiService: ApiService,public mensajeGlobal: MensajeGlobalService) {}

  ngOnInit(): void {
    this.apiService.getSolicitudesRecibidas().subscribe({
      next: (res) => {
        this.solicitudes = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener solicitudes:', err);
        this.cargando = false;
      }
    });
  }

  aceptar(id: number): void {
    this.apiService.aceptarSolicitudAmistad(id).subscribe({
      next: (res) => {
        this.solicitudes = this.solicitudes.filter(s => s.id !== id);
        this.mensajeGlobal.mostrar(res.mensaje ||'Solicitud aceptada.', 'success');
      },
      error: (err) => {
        console.error('Error al bloquear solicitud:', err);
        this.mensajeGlobal.mostrar(err.error?.error || 'Error al aceptar la solicitud', 'danger');
      }
    });
  }

  bloquear(id: number): void {
    if (!confirm('¿Seguro que quieres bloquear esta solicitud?')) return;

    this.apiService.bloquearSolicitudAmistad(id).subscribe({
      next: (res) => {
        this.solicitudes = this.solicitudes.filter(s => s.id !== id);
        this.mensajeGlobal.mostrar(res.mensaje ||'Solicitud bloqueada.', 'success');
      },
      error: (err) => {
        console.error('Error al bloquear solicitud:', err);
        this.mensajeGlobal.mostrar(err.error?.error || 'Error al bloquear solicitud', 'danger');
      }
    });
  }
}

