import { Component, Input, OnInit } from '@angular/core';
import { Estadistica, UsuarioRanking } from '../../servicios/api-servicios/api.models';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RelatoCardComponent } from "../../componentes/relatocard/relatocard.component";
import { UserLinkComponent } from "../../componentes/user-link/user-link.component";
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-ranking',
  imports: [CommonModule, RouterModule, UserLinkComponent],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css'
})
export class RankingComponent implements OnInit {
  // Relatos
  estadisticas: Estadistica[] = [];
  cargando = false;
  error = '';

  // Usuarios
  usuarios: UsuarioRanking[] = [];
  cargandoUsuarios = false;
  errorUsuarios = '';

  // Filtro
  filtroUsuarios: 'relatos' | 'votos' | 'palabras' = 'relatos';

  // Datos de sesión/amigos
  authenticated = false;
  currentUserId?: number;
  friendIds: number[] = [];

  constructor(
    private api: ApiService,
    private auth: AutenticacionService
  ) {}

  ngOnInit(): void {
    // 1) Estado de autenticación
    this.authenticated = !!this.auth.obtenerToken();

    // 2) Si estoy autenticado, cargo mi ID y lista de amigos
    if (this.authenticated) {
      this.api.getUsuarioPorToken().subscribe({
        next: me => {
          this.currentUserId = me.id;
          this.api.getAmigos().subscribe({
            next: amigos => this.friendIds = amigos.map(u => u.id),
            error: () => this.friendIds = []
          });
        },
        error: () => {
          this.currentUserId = undefined;
        }
      });
    }

    // 3) Cargo datos de ranking
    this.cargarRanking();
    this.cargarRankingUsuarios();
  }

  private cargarRanking(): void {
    this.cargando = true;
    this.api.getListadoEstadisticas().subscribe({
      next: datos => {
        this.estadisticas = datos;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el ranking de relatos.';
        this.cargando = false;
      }
    });
  }

  private cargarRankingUsuarios(): void {
    this.cargandoUsuarios = true;
    this.errorUsuarios = '';
    this.api.getRankingUsuarios(this.filtroUsuarios).subscribe({
      next: datos => {
        this.usuarios = datos;
        this.cargandoUsuarios = false;
      },
      error: () => {
        this.errorUsuarios = 'No se pudo cargar el ranking de usuarios.';
        this.cargandoUsuarios = false;
      }
    });
  }

  setFiltro(f: 'relatos' | 'votos' | 'palabras'): void {
    if (this.filtroUsuarios !== f) {
      this.filtroUsuarios = f;
      this.cargarRankingUsuarios();
    }
  }

  trackByRelato(index: number, item: Estadistica): any {
    return item.relato;
  }

  trackByUsuario(index: number, item: UsuarioRanking): number {
    return item.id;
  }
}

