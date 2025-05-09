import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { Comentario } from '../../servicios/api-servicios/api.models';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-comentarios',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {
  @Input() relatoId!: number;

  // --- Estado del componente ---
  comentarios: Comentario[] = [];
  comentarioForm: FormGroup;
  cargando = false;
  error = '';

  // --- Usuario y comentarios ---
  currentUserId!: number;
  hasComentado = false;

  // --- Edición comentario ---
  editingId: number | null = null;
  editText = '';

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public mensajeGlobal: MensajeGlobalService
  ) {
    this.comentarioForm = this.fb.group({
      texto: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.mensajeGlobal.limpiar();
    this.api.obtenerPerfil().subscribe({
      next: user => {
        this.currentUserId = user.id;
        this.loadComentarios();
      },
      error: () => {
        this.error = 'No se pudo obtener perfil.';
      }
    });
  }

  // --- Carga de comentarios ---
  private loadComentarios(): void {
    this.cargando = true;
    this.api.getComentarios(this.relatoId).subscribe({
      next: list => {
        this.comentarios = list;
        this.hasComentado = list.some(c => c.usuario.id === this.currentUserId);
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar comentarios.';
        this.cargando = false;
      }
    });
  }

  // --- Crear comentario ---
  enviarComentario(): void {
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

  // --- Edición de comentario ---
  iniciarEdicion(c: Comentario): void {
    this.editingId = c.id;
    this.editText = c.texto;
  }

  guardarEdicion(c: Comentario): void {
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

  // --- Borrado de comentario ---
  borrarComentario(c: Comentario): void {
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