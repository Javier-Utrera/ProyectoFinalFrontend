import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MensajeService } from '../../servicios/mensajes-emergentes/mensaje.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule,ReactiveFormsModule,NgSelectModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  datosUsuario: any = null;
  cargando = true;
  modoEdicion = false;
  formulario!: FormGroup;

  generosDisponibles: string[] = [
    'Fantasía', 'Ciencia ficción', 'Terror', 'Romance',
    'Aventura', 'Drama', 'Misterio', 'Histórica',
    'Poesía', 'Humor', 'Thriller', 'Infantil', 'Juvenil'
  ];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private mensajeService: MensajeService
  ) {}

  ngOnInit(): void {
    this.apiService.obtenerPerfil().subscribe({
      next: (res) => {
        this.datosUsuario = res;
        this.cargando = false;
        this.inicializarFormulario();
      },
      error: (err) => {
        console.error('Error al obtener el perfil:', err);
        this.cargando = false;
      }
    });
  }


  inicializarFormulario(): void {
    const hoy = new Date();

    this.formulario = this.fb.group({
      biografia: [this.datosUsuario.perfil.biografia || '', [Validators.maxLength(500)]],
      fecha_nacimiento: [
        this.datosUsuario.perfil.fecha_nacimiento || '',
        [Validators.required, this.fechaNoFuturaValidator()]
      ],
      pais: [
        this.datosUsuario.perfil.pais || '',
        [Validators.pattern('^[A-Za-záéíóúÁÉÍÓÚñÑ ]*$')]
      ],
      ciudad: [
        this.datosUsuario.perfil.ciudad || '',
        [Validators.pattern('^[A-Za-záéíóúÁÉÍÓÚñÑ ]*$')]
      ],
      generos_favoritos: [this.generosIniciales()]
    });
  }

  generosIniciales(): string[] {
    const valor = this.datosUsuario.perfil.generos_favoritos;
    return valor ? valor.split(',').map((g: string) => g.trim()) : [];
  }

  fechaNoFuturaValidator() {
    return (control: any) => {
      const hoy = new Date();
      const valor = new Date(control.value);
      return valor > hoy ? { fechaFutura: true } : null;
    };
  }

  activarEdicion(): void {
    this.inicializarFormulario();
    this.modoEdicion = true;
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.inicializarFormulario();
  }

  guardarCambios(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = { ...this.formulario.value };
    datos.generos_favoritos = datos.generos_favoritos.join(', ');

    this.apiService.actualizarPerfil(datos).subscribe({
      next: () => {
        this.mensajeService.mostrar('Perfil actualizado correctamente');
        this.modoEdicion = false;
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        this.mensajeService.mostrar('Error al actualizar el perfil');
      }
    });
  }
}
