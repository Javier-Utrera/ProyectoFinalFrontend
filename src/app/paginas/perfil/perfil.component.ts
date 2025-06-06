import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

import { ApiService } from '../../servicios/api-servicios/api.service';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';
import { Usuario } from '../../servicios/api-servicios/api.models';

import { MensajeAlertaComponent } from '../../componentes/comunes/mensaje-alerta/mensaje-alerta.component';
import { BotonPaypalComponent } from "../../componentes/comunes/boton-paypal/boton-paypal.component";

declare var paypal: any;

@Component({
  selector: 'app-perfil',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    MensajeAlertaComponent,
    BotonPaypalComponent
],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario!: Usuario;
  private currentUser?: Usuario;
  isOwner = false;

  error = '';
  cargando = true;

  modoEdicion = false;
  formulario!: FormGroup;
  selectedFile: File | null = null;

  facturaPdfUrl: string | null = null;

  generosDisponibles: string[] = [
    'Fantasía', 'Ciencia ficción', 'Terror', 'Romance',
    'Aventura', 'Drama', 'Misterio', 'Histórica',
    'Poesía', 'Humor', 'Thriller', 'Infantil', 'Juvenil'
  ];

  constructor(
    private api: ApiService,
    private auth: AutenticacionService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public mensajeGlobal: MensajeGlobalService
  ) { }


  onPaypalAprobado(event: { orderID: string }) {
    this.api.capturarYCrearSuscripcion({ orderID: event.orderID }).subscribe({
      next: (res) => {
        this.mensajeGlobal.mostrar('¡Pago realizado con éxito!', 'success');
  
        // Si el backend trae la URL del PDF, la guardamos en facturaPdfUrl
        if (res.factura && res.factura.pdf_url) {
          this.facturaPdfUrl = res.factura.pdf_url;
        }
  
        // Refrescamos el perfil para actualizar el estado de suscripción
        this.ngOnInit();
      },
      error: (err) => {
        this.mensajeGlobal.mostrar('No se pudo activar la suscripción', 'danger');
      }
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const targetId = idParam ? +idParam : undefined;
   
    

    if (this.auth.obtenerToken()) {
      this.api.obtenerPerfil().subscribe({
        next: me => {
          this.currentUser = me;
          this.isOwner = !targetId || me.id === targetId;
          this.fetchTarget(targetId);
        },
        error: () => {
          this.router.navigate(['/']);
        }
      });
    } else {
      this.fetchTarget(targetId);
    }
  }

  private fetchTarget(userId?: number): void {
    this.api.obtenerPerfil(userId).subscribe({
      next: perfil => {
        this.usuario = perfil;
        console.log('Perfil cargado:', this.usuario);
        this.cargando = false;
      },
      error: err => {
        this.error = err.error?.error || 'No se pudo cargar el perfil';
        this.cargando = false;
        if (err.status === 403 || err.status === 404) {
          this.router.navigate(['/']);
        }
      }
    });
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      biografia: [
        this.usuario.biografia || '',
        [Validators.maxLength(500)]
      ],
      fecha_nacimiento: [
        this.usuario.fecha_nacimiento || '',
        [this.fechaNoFuturaValidator()]
      ],
      pais: [
        this.usuario.pais || '',
        [Validators.pattern('^[A-Za-záéíóúÁÉÍÓÚñÑ ]*$')]
      ],
      ciudad: [
        this.usuario.ciudad || '',
        [Validators.pattern('^[A-Za-záéíóúÁÉÍÓÚñÑ ]*$')]
      ],
      generos_favoritos: [
        this.generosIniciales()
      ],
      avatar: [null]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.usuario.avatar = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  private generosIniciales(): string[] {
    return this.usuario.generos_favoritos
      ? this.usuario.generos_favoritos.split(',').map(g => g.trim())
      : [];
  }

  private fechaNoFuturaValidator() {
    return (control: any) => {
      const hoy = new Date();
      const valor = new Date(control.value);
      return valor > hoy ? { fechaFutura: true } : null;
    };
  }

  activarEdicion(): void {
    if (!this.isOwner) {
      return;
    }
    this.inicializarFormulario();
    this.modoEdicion = true;
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.inicializarFormulario();
  }

  guardarCambios(): void {
    if (!this.isOwner || this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const {
      biografia,
      fecha_nacimiento,
      pais,
      ciudad,
      generos_favoritos
    } = this.formulario.value;

    if (biografia) {
      formData.append('biografia', biografia);
    }
    if (fecha_nacimiento) {
      formData.append('fecha_nacimiento', fecha_nacimiento);
    }
    if (pais) {
      formData.append('pais', pais);
    }
    if (ciudad) {
      formData.append('ciudad', ciudad);
    }
    if (generos_favoritos?.length) {
      formData.append('generos_favoritos', generos_favoritos.join(', '));
    }
    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    this.api.actualizarPerfil(formData).subscribe({
      next: res => {
        this.modoEdicion = false;
        this.ngOnInit();
        this.mensajeGlobal.mostrar(
          res.mensaje || 'Perfil actualizado.',
          'success'
        );
      },
      error: err => {
        this.mensajeGlobal.mostrar(
          err.error?.error || 'Error al actualizar perfil',
          'danger'
        );
      }
    });
  }
}
function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}

