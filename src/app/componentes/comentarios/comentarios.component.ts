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

import { Comentario, ComentariosPorSecciones } from '../../servicios/api-servicios/api.models';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { UserLinkComponent } from "../user-link/user-link.component";


@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, UserLinkComponent],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {
  @Input() relatoId!: number;

  comentariosAmigos: Comentario[] = [];
  comentariosOtros: Comentario[] = [];

  comentarioForm: FormGroup;
  cargando = false;
  error = '';

  currentUserId!: number;
  hasComentado = false;

  editingId: number | null = null;
  editText = '';

  /** Clave de orden actual */
  sortKey: 'fechaDesc' | 'fechaAsc' | 'votosDesc' | 'votosAsc' = 'fechaDesc';

  /** Funciones comparadoras para cada modo de orden */
  private comparators: Record<string, (a: Comentario, b: Comentario) => number> = {
    fechaAsc: (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
    fechaDesc: (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    votosAsc: (a, b) => a.votos - b.votos,
    votosDesc: (a, b) => b.votos - a.votos,
  };

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public mensajeGlobal: MensajeGlobalService,
    private authService: AutenticacionService,
    private router: Router
  ) {
    this.comentarioForm = this.fb.group({
      texto: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.mensajeGlobal.limpiar();
    this.loadComentarios();

    if (this.isAuth) {
      this.api.obtenerPerfil().subscribe({
        next: user => {
          this.currentUserId = user.id;
          // Decide si ya comentaste
          this.hasComentado = [...this.comentariosAmigos, ...this.comentariosOtros]
            .some(c => c.usuario.id === user.id);
        },
        error: () => { }
      });
    }
  }

  /** True si hay token */
  get isAuth(): boolean {
    return !!this.authService.obtenerToken();
  }

  /** Redirige a login */
  goToLogin(): void {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }

  /** Carga comentarios y los ordena */
  private loadComentarios(): void {
    this.cargando = true;
    this.api.getComentarios(this.relatoId).subscribe({
      next: (data: ComentariosPorSecciones) => {
        this.comentariosAmigos = data.amigos;
        this.comentariosOtros = data.otros;
        this.applySort();
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar comentarios.';
        this.cargando = false;
      }
    });
  }

  /** Cambia el modo de orden y aplica */
  setSort(key: 'fechaDesc' | 'fechaAsc' | 'votosDesc' | 'votosAsc'): void {
    this.sortKey = key;
    this.applySort();
  }

  /** Reordena ambos arrays según `sortKey` */
  private applySort(): void {
    const cmp = this.comparators[this.sortKey];
    this.comentariosAmigos.sort(cmp);
    this.comentariosOtros.sort(cmp);
  }

  /** Envía un nuevo comentario */
  enviarComentario(): void {
    if (!this.isAuth) { this.goToLogin(); return; }
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
        // Lo insertamos en "otros" ya que no somos amigos de nosotros mismos
        this.comentariosOtros.unshift(nuevo);
        this.hasComentado = true;
        this.comentarioForm.reset();
        this.applySort();
        this.mensajeGlobal.mostrar('Comentario enviado', 'success');
      },
      error: err => {
        this.mensajeGlobal.mostrar(err.error?.error || 'Error al enviar', 'danger');
      }
    });
  }

  puedeModificar(c: Comentario): boolean {
    // administradores o moderadores
    if (this.authService.hasRole(1, 3)) return true;
    // autor del comentario
    return c.usuario.id === this.currentUserId;
  }

  /** Inicia la edición de un comentario */
  iniciarEdicion(c: Comentario): void {
    if (!this.isAuth) { this.goToLogin(); return; }
    if (!this.puedeModificar(c)) return;
    this.editingId = c.id;
    this.editText = c.texto;
  }

  /** Guarda la edición de un comentario */
  guardarEdicion(c: Comentario): void {
    if (!this.isAuth) { this.goToLogin(); return; }
    const texto = this.editText.trim();
    if (!texto) { return; }

    this.api.editarComentario(this.relatoId, c.id, texto).subscribe({
      next: updated => {
        const replaceIn = (arr: Comentario[]) => {
          const idx = arr.findIndex(x => x.id === c.id);
          if (idx > -1) arr[idx] = updated;
        };
        replaceIn(this.comentariosAmigos);
        replaceIn(this.comentariosOtros);
        this.cancelarEdicion();
        this.mensajeGlobal.mostrar('Comentario editado', 'success');
      },
      error: err => {
        this.mensajeGlobal.mostrar(err.error?.error || 'Error al editar', 'danger');
      }
    });
  }

  /** Cancela el modo edición */
  cancelarEdicion(): void {
    this.editingId = null;
    this.editText = '';
  }

  /** Borra un comentario */
  borrarComentario(c: Comentario): void {
    if (!this.isAuth) { this.goToLogin(); return; }
    if (!this.puedeModificar(c)) {
      this.mensajeGlobal.mostrar('No tienes permiso', 'warning');
      return;
    }

    this.api.borrarComentario(this.relatoId, c.id).subscribe({
      next: () => {
        this.comentariosAmigos = this.comentariosAmigos.filter(x => x.id !== c.id);
        this.comentariosOtros = this.comentariosOtros.filter(x => x.id !== c.id);
        this.hasComentado = false;
        this.mensajeGlobal.mostrar('Comentario eliminado', 'success');
      },
      error: err => {
        this.mensajeGlobal.mostrar(err.error?.error || 'Error al eliminar', 'danger');
      }
    });
  }

  /** Vota positivo o quita voto positivo */
  votarComentario(c: Comentario): void {
    if (!this.isAuth) { this.goToLogin(); return; }

    if (c.mi_voto === 1) {
      this.api.eliminarVotoComentario(this.relatoId, c.id).subscribe(updated => {
        c.votos = updated.votos;
        c.mi_voto = updated.mi_voto;
        this.applySort();
      });
    } else {
      this.api.votarComentario(this.relatoId, c.id).subscribe(updated => {
        c.votos = updated.votos;
        c.mi_voto = updated.mi_voto;
        this.applySort();
      });
    }
  }

  /** Vota negativo o quita voto negativo */
  votarAbajoComentario(c: Comentario): void {
    if (!this.isAuth) { this.goToLogin(); return; }

    if (c.mi_voto === -1) {
      this.api.eliminarVotoComentario(this.relatoId, c.id).subscribe(updated => {
        c.votos = updated.votos;
        c.mi_voto = updated.mi_voto;
        this.applySort();
      });
    } else {
      this.api.quitarVotoComentario(this.relatoId, c.id).subscribe(updated => {
        c.votos = updated.votos;
        c.mi_voto = updated.mi_voto;
        this.applySort();
      });
    }
  }
}
