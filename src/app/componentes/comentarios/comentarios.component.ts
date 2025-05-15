import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { Router } from '@angular/router';

import { Comentario } from '../../servicios/api-servicios/api.models';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';


@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {
  @Input() relatoId!: number;

  comentarios: Comentario[] = [];
  comentarioForm: FormGroup;
  cargando = false;
  error = '';

  currentUserId!: number;
  hasComentado = false;

  editingId: number | null = null;
  editText = '';

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public  mensajeGlobal: MensajeGlobalService,
    private authService: AutenticacionService,
    private router: Router
  ) {
    this.comentarioForm = this.fb.group({
      texto: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.mensajeGlobal.limpiar();
    // 1) Carga siempre los comentarios públicos
    this.loadComentarios();

    // 2) Si está autenticado, obtén perfil y calcula hasComentado
    if (this.isAuth) {
      this.api.obtenerPerfil().subscribe({
        next: user => {
          this.currentUserId = user.id;
          this.hasComentado = this.comentarios.some(c => c.usuario.id === user.id);
        },
        error: () => {
          // ignorar
        }
      });
    }
  }

  /** true si hay token almacenado */
  get isAuth(): boolean {
    return !!this.authService.obtenerToken();
  }

  /** Redirige al login guardando la URL actual */
  goToLogin(): void {
    this.router.navigate(
      ['/login'],
      { queryParams: { returnUrl: this.router.url } }
    );
  }

  private loadComentarios(): void {
    this.cargando = true;
    this.api.getComentarios(this.relatoId).subscribe({
      next: list => {
        this.comentarios = list;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar comentarios.';
        this.cargando = false;
      }
    });
  }

  enviarComentario(): void {
    if (!this.isAuth) {
      this.goToLogin();
      return;
    }
    if (this.comentarioForm.invalid) {
      this.comentarioForm.markAllAsTouched();
      return;
    }
    const texto = this.comentarioForm.value.texto.trim();
    if (!texto) {
      this.comentarioForm.setErrors({ empty: true });
      return;
    }

    this.api.crearComentario(this.relatoId, texto).subscribe({
      next: nuevo => {
        this.comentarios.unshift(nuevo);
        this.hasComentado = true;
        this.comentarioForm.reset();
        this.mensajeGlobal.mostrar('Comentario enviado', 'success');
      },
      error: err => {
        this.mensajeGlobal.mostrar(err.error?.error || 'Error al enviar', 'danger');
      }
    });
  }

  iniciarEdicion(c: Comentario): void {
    if (!this.isAuth) {
      this.goToLogin();
      return;
    }
    this.editingId = c.id;
    this.editText = c.texto;
  }

  guardarEdicion(c: Comentario): void {
    if (!this.isAuth) {
      this.goToLogin();
      return;
    }
    const texto = this.editText.trim();
    if (!texto) { return; }

    this.api.editarComentario(this.relatoId, c.id, texto).subscribe({
      next: updated => {
        const idx = this.comentarios.findIndex(x => x.id === c.id);
        if (idx > -1) { this.comentarios[idx] = updated; }
        this.cancelarEdicion();
        this.mensajeGlobal.mostrar('Comentario editado', 'success');
      },
      error: err => {
        this.mensajeGlobal.mostrar(err.error?.error || 'Error al editar', 'danger');
      }
    });
  }

  cancelarEdicion(): void {
    this.editingId = null;
    this.editText = '';
  }

  borrarComentario(c: Comentario): void {
    if (!this.isAuth) {
      this.goToLogin();
      return;
    }
    this.api.borrarComentario(this.relatoId, c.id).subscribe({
      next: () => {
        this.comentarios = this.comentarios.filter(x => x.id !== c.id);
        this.hasComentado = false;
        this.mensajeGlobal.mostrar('Comentario eliminado', 'success');
      },
      error: err => {
        this.mensajeGlobal.mostrar(err.error?.error || 'Error al eliminar', 'danger');
      }
    });
  }
}
