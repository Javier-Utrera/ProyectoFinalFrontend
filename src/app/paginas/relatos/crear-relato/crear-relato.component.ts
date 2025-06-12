import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { EditorComponent } from '../../../componentes/editor/editor.component';
import { CommonModule } from '@angular/common';
import { OpcionesRelato } from '../../../servicios/api-servicios/api.models';

@Component({
  selector: 'app-crear-relato',
  imports: [CommonModule, ReactiveFormsModule, EditorComponent],
  templateUrl: './crear-relato.component.html',
  styleUrls: ['./crear-relato.component.css'],
})
export class CrearRelatoComponent implements OnInit {
  formulario!: FormGroup;
  enviado = false;
  contenidoHtml = '';

  idiomas: { value: string; label: string }[] = [];
  generos: { value: string; label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      contenido: [''],
      idioma: ['', Validators.required],
      generos: [''],
      num_escritores: [1, [Validators.required, Validators.min(1), Validators.max(4)]]
    });

    this.apiService.getOpcionesRelato()
      .subscribe((opts: OpcionesRelato) => {
        this.idiomas = opts.idiomas.map(([value, label]) => ({ value, label }));
        this.generos = opts.generos.map(([value, label]) => ({ value, label }));
      });
  }

  onSubmit(): void {
    this.enviado = true;
    if (this.formulario.invalid) {
      return;
    }

    const datos = {
      ...this.formulario.value,
      contenido: this.contenidoHtml
    };

    this.apiService.crearRelato(datos)
      .subscribe({
        next: () => {
          this.router.navigate(['/mis-relatos']);
        },
        error: () => {
        }
      });
  }
}
