import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-usuarios-bloqueados',
  standalone: true,
  templateUrl: './usuarios-bloqueados.component.html',
  styleUrls: ['./usuarios-bloqueados.component.css']
})
export class UsuariosBloqueadosComponent implements OnInit {
  usuarios: any[] = [];
  cargando = true;

  constructor(
    private api: ApiService,
    public mensajeGlobal: MensajeGlobalService
  ) {}

  ngOnInit(): void {
    this.cargarBloqueados();
  }

  private cargarBloqueados(): void {
    this.cargando = true;
    this.api.getUsuariosBloqueados().subscribe({
      next: res => {
        this.usuarios = res;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  async desbloquear(usuarioId: number): Promise<void> {
    const confirmado = await this.mensajeGlobal.confirmar(
      '¿Estás seguro de que quieres desbloquear a este usuario?'
    );
    if (!confirmado) return;

    this.api.desbloquearUsuario(usuarioId).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== usuarioId);
      },
      error: () => {
      }
    });
  }
}
