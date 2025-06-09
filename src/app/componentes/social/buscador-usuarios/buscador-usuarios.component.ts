import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';
import { LibroCargaComponent } from "../../comunes/libro-carga/libro-carga.component";
import { CloudinaryOptPipe } from "../../../cloudinary-opt.pipe";

@Component({
  selector: 'app-buscador-usuarios',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, LibroCargaComponent, CloudinaryOptPipe],
  templateUrl: './buscador-usuarios.component.html',
  styleUrls: ['./buscador-usuarios.component.css']
})
export class BuscadorUsuariosComponent implements OnInit {
  formulario!: FormGroup;
  resultados: any[] = [];
  buscando = false;
  mensajeNoEncontrado: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public mensajeGlobal: MensajeGlobalService
  ) {}

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
    this.mensajeNoEncontrado = null;
    this.resultados = [];

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valor = this.termino!.value.trim();
    this.buscando = true;

    this.apiService.buscarUsuarios(valor).subscribe({
      next: res => {
        this.resultados = res;
        this.buscando = false;
        if (res.length === 0) {
          this.mensajeNoEncontrado = 'No se encontraron usuarios con ese nombre.';
        }
      },
      error: () => {
        this.buscando = false;
        // el error ya sale por toast desde handleError()
      }
    });
  }

  /** Envia petición tras confirmar por modal */
  async enviarSolicitud(usuarioId: number): Promise<void> {
    const confirmado = await this.mensajeGlobal.confirmar(
      '¿Deseas enviar una solicitud de amistad a este usuario?'
    );
    if (!confirmado) return;

    this.apiService.enviarSolicitudAmistad(usuarioId).subscribe({
      next: () => {
        // el toast de éxito ya sale en handleSuccess()
        // quitamos de la lista
        this.resultados = this.resultados.filter(u => u.id !== usuarioId);
      },
      error: () => {
        // el toast de error ya sale en handleError()
      }
    });
  }
}
