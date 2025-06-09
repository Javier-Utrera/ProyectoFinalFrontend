import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';
import { LibroCargaComponent } from "../../comunes/libro-carga/libro-carga.component";

@Component({
  selector: 'app-solicitudes-recibidas',
  standalone: true,
  templateUrl: './solicitudes-recibidas.component.html',
  styleUrls: ['./solicitudes-recibidas.component.css'],
  imports: [LibroCargaComponent]
})
export class SolicitudesRecibidasComponent implements OnInit {
  solicitudes: any[] = [];
  cargando = true;

  constructor(
    private apiService: ApiService,
    public mensajeGlobal: MensajeGlobalService
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  private cargarSolicitudes(): void {
    this.cargando = true;
    this.apiService.getSolicitudesRecibidas().subscribe({
      next: res => {
        this.solicitudes = res;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  aceptar(id: number): void {
    this.apiService.aceptarSolicitudAmistad(id).subscribe({
      next: () => {
        this.solicitudes = this.solicitudes.filter(s => s.id !== id);
      },
      error: () => {
      }
    });
  }

  /** Bloquea tras confirmación modal */
  async bloquear(id: number): Promise<void> {
    const confirmado = await this.mensajeGlobal.confirmar(
      '¿Estás seguro de que quieres bloquear esta solicitud?'
    );
    if (!confirmado) return;

    this.apiService.bloquearSolicitudAmistad(id).subscribe({
      next: () => {
        this.solicitudes = this.solicitudes.filter(s => s.id !== id);
      },
      error: () => {
      }
    });
  }
}
