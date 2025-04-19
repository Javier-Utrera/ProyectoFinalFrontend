import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-usuarios-bloqueados',
  imports: [],
  templateUrl: './usuarios-bloqueados.component.html',
  styleUrl: './usuarios-bloqueados.component.css'
})
export class UsuariosBloqueadosComponent implements OnInit {
  usuarios: any[] = [];
  cargando = true;

  constructor(private api: ApiService, public mensajeGlobal: MensajeGlobalService) {}

  ngOnInit(): void {
    this.api.getUsuariosBloqueados().subscribe({
      next: (res) => {
        this.usuarios = res;
        this.cargando = false;
      },
      error: () => {
        this.mensajeGlobal.mostrar('Error al obtener usuarios bloqueados.', 'danger');
        this.cargando = false;
      }
    });
  }

  desbloquear(usuarioId: number): void {
    this.api.desbloquearUsuario(usuarioId).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== usuarioId);
        this.mensajeGlobal.mostrar('Usuario desbloqueado correctamente.', 'success');
      },
      error: () => {
        this.mensajeGlobal.mostrar('Error al desbloquear usuario.', 'danger');
      }
    });
  }
}
