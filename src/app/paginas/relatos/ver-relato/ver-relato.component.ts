import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { ComentariosComponent } from "../../../componentes/comentarios/comentarios.component";
import { PuntuacionComponent } from "../../../componentes/puntuacion/puntuacion.component";
import { MensajeAlertaComponent } from "../../../componentes/comunes/mensaje-alerta/mensaje-alerta.component";
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-ver-relato',
  imports: [ComentariosComponent, PuntuacionComponent, MensajeAlertaComponent],
  templateUrl: './ver-relato.component.html',
  styleUrl: './ver-relato.component.css'
})
export class VerRelatoComponent implements OnInit {
  relato: any = null;
  cargando = true;
  relatoId!: number;
  origen: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    public mensajeGlobal: MensajeGlobalService
  ) {}

  ngOnInit(): void {
    this.relatoId = Number(this.route.snapshot.paramMap.get('id'));
    this.origen = this.route.snapshot.queryParamMap.get('origen');

    const peticion = this.origen === 'publicado'
      ? this.apiService.getRelatoPorIdPublico(this.relatoId)
      : this.apiService.getRelatoPorId(this.relatoId);

    peticion.subscribe({
      next: (res) => {
        this.relato = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener el relato:', err);
        this.cargando = false;

        if (err.status === 403 || err.status === 404) {
          const redir = this.origen === 'publicado' ? '/relatos-publicados' : '/mis-relatos';
          this.router.navigate([redir]);
        }
      }
    });
  }
}
