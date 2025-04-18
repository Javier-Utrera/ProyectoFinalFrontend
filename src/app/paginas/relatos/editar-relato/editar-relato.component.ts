import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../servicios/api-servicios/api.service';

@Component({
  selector: 'app-editar-relato',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-relato.component.html',
  styleUrl: './editar-relato.component.css'
})
export class EditarRelatoComponent implements OnInit {
  formulario!: FormGroup;
  relatoId!: number;
  cargando = true;
  enviado = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.relatoId = Number(this.route.snapshot.paramMap.get('id'));

    this.apiService.getRelatoPorId(this.relatoId).subscribe({
      next: (relato) => {
        this.formulario = this.fb.group({
          titulo: [relato.titulo, [Validators.required, Validators.minLength(3)]],
          descripcion: [relato.descripcion, [Validators.required, Validators.minLength(10)]],
          contenido: [relato.contenido || ''],
          idioma: [relato.idioma, Validators.required],
        });
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar relato:', err);
        this.router.navigate(['/mis-relatos']);
      }
    });
  }

  onSubmit(): void {
    this.enviado = true;
    if (this.formulario.invalid) return;

    this.apiService.editarRelato(this.relatoId, this.formulario.value).subscribe({
      next: () => {
        this.router.navigate(['/mis-relatos']);
      },
      error: (err) => {
        console.error('Error al editar el relato:', err);
      }
    });
  }

  marcarListo(): void {
    this.apiService.marcarRelatoListo(this.relatoId).subscribe({
      next: (res) => {
        alert(res.mensaje);
        this.router.navigate(['/mis-relatos']);
      },
      error: (err) => {
        console.error('Error al marcar como listo:', err);
      }
    });
  }
}
