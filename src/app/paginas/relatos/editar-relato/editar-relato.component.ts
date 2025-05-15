import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { EditorFragmentoComponent } from '../../../componentes/editor-fragmento/editor-fragmento.component';


@Component({
  selector: 'app-editar-relato',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditorFragmentoComponent
  ],
  templateUrl: './editar-relato.component.html',
  styleUrls: ['./editar-relato.component.css']
})
export class EditarRelatoComponent implements OnInit {
  formulario!: FormGroup;
  relatoId!: number;
  cargando = true;
  enviado = false;
  esCreador = false;

  // Guardamos el relato para mostrarlo en modo solo lectura
  relato: any = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.relatoId = Number(this.route.snapshot.paramMap.get('id'));

    this.apiService.getRelatoPorId(this.relatoId).subscribe({
      next: relato => {
        this.relato = relato;
        const userId = Number(localStorage.getItem('userId'));
        this.esCreador = relato.autores[0] === userId;

        this.formulario = this.fb.group({
          titulo:      [relato.titulo,      [Validators.required, Validators.minLength(3)]],
          descripcion: [relato.descripcion, [Validators.required, Validators.minLength(10)]],
          idioma:      [relato.idioma,      [Validators.required]]
        });

        this.cargando = false;
      },
      error: err => {
        console.error('Error al cargar el relato:', err);
        this.router.navigate(['/mis-relatos']);
      }
    });
  }

  onSubmit(): void {
    this.enviado = true;
    if (!this.esCreador || this.formulario.invalid) {
      return;
    }
    this.apiService.editarRelato(this.relatoId, this.formulario.value).subscribe({
      next: () => {
        alert('Metadatos guardados correctamente');
      },
      error: err => console.error('Error al actualizar metadatos:', err)
    });
  }

  onFragmentoListo(): void {
    this.router.navigate(['/mis-relatos']);
  }
}
