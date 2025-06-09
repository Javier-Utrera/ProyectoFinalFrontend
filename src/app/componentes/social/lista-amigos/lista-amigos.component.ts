import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';
import { LibroCargaComponent } from "../../comunes/libro-carga/libro-carga.component";
import { UserLinkComponent } from "../../user-link/user-link.component";

@Component({
  selector: 'app-lista-amigos',
  standalone: true,
  templateUrl: './lista-amigos.component.html',
  styleUrls: ['./lista-amigos.component.css'],
  imports: [LibroCargaComponent, UserLinkComponent]
})
export class ListaAmigosComponent implements OnInit {
  amigos: any[] = [];
  cargando = true;

  constructor(
    private apiService: ApiService,
    public mensajeGlobal: MensajeGlobalService
  ) {}

  ngOnInit(): void {
    this.cargarAmigos();
  }

  private cargarAmigos(): void {
    this.cargando = true;
    this.apiService.getAmigos().subscribe({
      next: res => {
        this.amigos = res;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  /** Usamos el modal en lugar de window.confirm */
  async eliminarAmigo(usuarioId: number): Promise<void> {
    const confirmado = await this.mensajeGlobal.confirmar(
      '¿Estás seguro de que quieres eliminar a este amigo?'
    );
    if (!confirmado) return;

    this.apiService.eliminarAmigo(usuarioId).subscribe({
      next: () => {
        this.amigos = this.amigos.filter(a => a.id !== usuarioId);
      },
      error: () => {
      }
    });
  }
}
