import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-lista-amigos',
  imports: [],
  templateUrl: './lista-amigos.component.html',
  styleUrl: './lista-amigos.component.css'
})
export class ListaAmigosComponent implements OnInit {
  amigos: any[] = [];
  cargando = true;

  constructor(private apiService: ApiService,public mensajeGlobal: MensajeGlobalService) {}

  ngOnInit(): void {
    this.apiService.getAmigos().subscribe({
      next: (res) => {
        this.amigos = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener amigos:', err);
        this.mensajeGlobal.mostrar(err.error?.error || 'Error al obtener amigos.', 'danger');       
        this.cargando = false;
      }
    });
  }

  eliminarAmigo(usuarioId: number): void {
    if (!confirm('¿Seguro que quieres eliminar a este amigo?')) return;

    this.apiService.eliminarAmigo(usuarioId).subscribe({
      next: (res) => {
        this.amigos = this.amigos.filter(a => a.id !== usuarioId);
        this.mensajeGlobal.mostrar('Amigo eliminado correctamente.', 'success');
      },
      error: (err) => {
        console.error('Error al eliminar amigo:', err);
        this.mensajeGlobal.mostrar(err.error?.error || 'Error al eliminar amigo.', 'danger');
      }
    });
  }

}
