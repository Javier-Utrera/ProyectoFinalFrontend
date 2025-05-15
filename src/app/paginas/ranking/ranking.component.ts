import { Component, Input, OnInit } from '@angular/core';
import { Estadistica } from '../../servicios/api-servicios/api.models';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RelatoCardComponent } from "../../componentes/relatocard/relatocard.component";

@Component({
  selector: 'app-ranking',
  imports: [CommonModule, RouterModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css'
})
export class RankingComponent implements OnInit {
  estadisticas: Estadistica[] = [];
  cargando = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarRanking();
  }

  private cargarRanking(): void {
    this.cargando = true;
    this.api.getListadoEstadisticas().subscribe({
      next: datos => {
        this.estadisticas = datos;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el ranking.';
        this.cargando = false;
      }
    });
  }
}

