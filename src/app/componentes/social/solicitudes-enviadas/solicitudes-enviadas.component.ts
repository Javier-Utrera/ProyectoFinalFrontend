import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-solicitudes-enviadas',
  imports: [],
  templateUrl: './solicitudes-enviadas.component.html',
  styleUrl: './solicitudes-enviadas.component.css'
})
export class SolicitudesEnviadasComponent implements OnInit {
  solicitudes: any[] = [];
  cargando = true;

  constructor(private apiService: ApiService,public mensajeGlobal: MensajeGlobalService) {}

  ngOnInit(): void {
    this.apiService.getSolicitudesEnviadas().subscribe({
      next: (res) => {
        this.solicitudes = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener solicitudes enviadas:', err);
        this.cargando = false;
      }
    });
  }
}
