import { Component, Input, OnInit } from '@angular/core';

import { ApiService } from '../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-puntuacion',
  imports: [],
  templateUrl: './puntuacion.component.html',
  styleUrl: './puntuacion.component.css'
})
export class PuntuacionComponent implements OnInit {
  @Input() relatoId!: number;

  miPuntuacion = 0;
  hover = 0;

  constructor(
    private api: ApiService,
    public mensajeGlobal: MensajeGlobalService
  ) {}

  ngOnInit(): void {
    this.mensajeGlobal.limpiar();
    this.api.getMiVoto(this.relatoId).subscribe({
      next: voto => {
        this.miPuntuacion = voto.puntuacion;
      },
      // si da 404, simplemente dejamos miPuntuacion = 0
      error: () => {}
    });
  }

  votar(p: number): void {
    this.api.votarRelato(this.relatoId, p).subscribe({
      next: voto => {
        this.miPuntuacion = voto.puntuacion;
        this.mensajeGlobal.mostrar('Voto registrado correctamente', 'success');
      },
      error: err => {
        const msg = err.error?.error || 'Error al enviar el voto';
        this.mensajeGlobal.mostrar(msg, 'danger');
      }
    });
  }
}
