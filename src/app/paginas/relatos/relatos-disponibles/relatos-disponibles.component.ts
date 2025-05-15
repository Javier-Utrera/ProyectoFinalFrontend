import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { RelatoCardComponent } from "../../../componentes/relatocard/relatocard.component";
import { PaginatedResponse, Relato } from '../../../servicios/api-servicios/api.models';

@Component({
  selector: 'app-relatos-disponibles',
  imports: [RelatoCardComponent],
  templateUrl: './relatos-disponibles.component.html',
  styleUrl: './relatos-disponibles.component.css'
})
export class RelatosDisponiblesComponent implements OnInit {
  relatos: Relato[] = [];
  cargando = true;
  autenticado = false;
  total = 0;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.autenticado = !!localStorage.getItem('token');
    this.cargarRelatos();
  }

  private cargarRelatos(params: any = {}): void {
    this.cargando = true;
    this.apiService
      .getRelatosDisponibles(params)
      .subscribe({
        next: (res: PaginatedResponse<Relato>) => {
          this.relatos = res.results;
          this.total   = res.count;
          this.cargando = false;
        },
        error: err => {
          console.error('Error al cargar relatos disponibles:', err);
          this.cargando = false;
        }
      });
  }

  unirse(id: number): void {
    if (!this.autenticado) {
      this.router.navigate(['/login'], {
        queryParams: { returnTo: this.router.url }
      });
      return;
    }

    this.apiService.unirseARelato(id).subscribe({
      next: (res) => {
        alert(res.mensaje);
        this.router.navigate(['/mis-relatos']);
      },
      error: (err) => {
        console.error('Error al unirse al relato:', err);
        alert('Error al unirse al relato.');
      }
    });
  }
}
