import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../servicios/api-servicios/api.service';

@Component({
  selector: 'app-ver-relato',
  imports: [CommonModule],
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
    private router: Router
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
