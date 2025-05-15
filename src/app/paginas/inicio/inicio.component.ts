import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { EstadisticasRelatoComponent } from '../../componentes/estadisticas-relato/estadisticas-relato.component';
import { RelatoCardComponent } from "../../componentes/relatocard/relatocard.component";
import { PaginatedResponse, Relato } from '../../servicios/api-servicios/api.models';


@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterModule, RelatoCardComponent],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  relatos: Relato[] = [];
  total = 0;
  cargando = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarRelatos();
  }

  private cargarRelatos(params: any = {}): void {
    this.cargando = true;
    this.apiService.getRelatosPublicados(params).subscribe({
      next: (res: PaginatedResponse<Relato>) => {
        this.relatos = res.results;
        this.total   = res.count;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }
}

