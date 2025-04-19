import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';
@Component({
  selector: 'app-buscador-usuarios',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './buscador-usuarios.component.html',
  styleUrl: './buscador-usuarios.component.css'
})
export class BuscadorUsuariosComponent implements OnInit {
  formulario!: FormGroup;
  resultados: any[] = [];
  buscando = false;

  mensaje: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService,public mensajeGlobal: MensajeGlobalService) { }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      termino: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[\\w.@+-]+$')
        ]
      ]
    });
  }

  get termino() {
    return this.formulario.get('termino');
  }

  buscar(): void {
    this.mensaje = null;
    this.resultados = [];

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valor = this.formulario.value.termino.trim();
    this.buscando = true;

    this.apiService.buscarUsuarios(valor).subscribe({
      next: (res) => {
        this.resultados = res;
        this.buscando = false;
        if (res.length === 0) {
          this.mensaje = 'No se encontraron usuarios con ese nombre.';
        }
      },
      error: (err) => {
        console.error('Error al buscar usuarios:', err);
        this.buscando = false;
        this.mensajeGlobal.mostrar(err.error?.error ||'Error en la busqueda de usuarios', 'danger');
      }
    });
  }

  enviarSolicitud(usuarioId: number): void {
    this.apiService.enviarSolicitudAmistad(usuarioId).subscribe({
      next: (res) => {
        this.resultados = this.resultados.filter(u => u.id !== usuarioId);
        this.mensajeGlobal.mostrar('Peticion de amistad enviada', 'success');
      },
      error: (err) => {
        console.error('Error al enviar solicitud:', err);
        this.mensajeGlobal.mostrar(err.error?.error ||'Error en la busqueda de usuarios', 'danger');
      }
    });
  }
}