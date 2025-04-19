import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GestorAmistadesComponent } from "../../componentes/social/gestor-amistades/gestor-amistades.component";
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';
import { MensajeAlertaComponent } from '../../componentes/comunes/mensaje-alerta/mensaje-alerta.component';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, NgSelectModule, GestorAmistadesComponent,MensajeAlertaComponent],
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
    public mensajeGlobal: MensajeGlobalService
  ) {}

  ngOnInit(): void {
    this.mensajeGlobal.limpiar();
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
      biografia: [this.datosUsuario.biografia || '', [Validators.maxLength(500)]],
      fecha_nacimiento: [
        this.datosUsuario.fecha_nacimiento || '',
        [this.fechaNoFuturaValidator()]
      ],
      pais: [
        this.datosUsuario.pais || '',
        [Validators.pattern('^[A-Za-záéíóúÁÉÍÓÚñÑ ]*$')]
      ],
      ciudad: [
        this.datosUsuario.ciudad || '',
        [Validators.pattern('^[A-Za-záéíóúÁÉÍÓÚñÑ ]*$')]
      ],
      generos_favoritos: [this.generosIniciales()]
    });
  }

  generosIniciales(): string[] {
    const valor = this.datosUsuario.generos_favoritos;
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

    // Eliminar campos vacíos
    if (datos.fecha_nacimiento === '') {
      delete datos.fecha_nacimiento;
    }
    console.log(datos.fecha_nacimiento)
    // Convertir géneros a string
    datos.generos_favoritos = datos.generos_favoritos.join(', ');

    this.apiService.actualizarPerfil(datos).subscribe({
      next: (res) => {
        this.modoEdicion = false;
        this.ngOnInit();
        this.mensajeGlobal.mostrar(res.mensaje ||'Perfil actualizado.', 'success');
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        this.mensajeGlobal.mostrar(err.error?.error || 'Error al actualizar perfil', 'danger');
      }
    });
  }
}
