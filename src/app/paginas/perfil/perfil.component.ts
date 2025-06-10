import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

import { ApiService } from '../../servicios/api-servicios/api.service';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';
import { Usuario } from '../../servicios/api-servicios/api.models';

import { BotonPaypalComponent } from '../../componentes/comunes/boton-paypal/boton-paypal.component';
import { LibroCargaComponent } from "../../componentes/comunes/libro-carga/libro-carga.component";
import { CloudinaryOptPipe } from '../../cloudinary-opt.pipe';

@Component({
  selector: 'app-perfil',
  imports: [
    CommonModule,
    NgSelectModule,
    BotonPaypalComponent,
    LibroCargaComponent,
    ReactiveFormsModule,
    CloudinaryOptPipe
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario!: Usuario;
  currentUser?: Usuario;
  isOwner = false;

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
    public msj: MensajeGlobalService
  ) { }

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
          this.msj.mostrar('No se pudo cargar tu sesión', 'danger');
          this.router.navigate(['/']);
        }
      });
    } else {
      this.fetchTarget(targetId);
    }
  }

  private fetchTarget(userId?: number): void {
    this.api.obtenerPerfil(userId)
      .subscribe({
        next: perfil => {
          this.usuario = perfil;
          this.cargando = false;
        },
        error: () => {
          this.router.navigate(['/']);
        }
      });
  }

  activarEdicion(): void {
    if (!this.isOwner) return;
    this.inicializarFormulario();
    this.modoEdicion = true;
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
  }

  // ========== VALIDADORES PERSONALIZADOS ==========

  // Valida letras, números, espacios y ciertos símbolos para biografía
  private biografiaValidator(): ValidatorFn {
    // Permitidos: letras, números, espacios, . , ; : ! ? ¡ ¿ " ' - ( ) y saltos de línea
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ0-9 .,;:!?¡¿"'\-\(\)\n\r]*$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (valor && !regex.test(valor)) {
        return { caracteresInvalidos: true };
      }
      return null;
    };
  }

  // País y ciudad: solo letras y espacios
  private soloLetrasEspaciosValidator(): ValidatorFn {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ ]*$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (valor && !regex.test(valor)) {
        return { caracteresInvalidos: true };
      }
      return null;
    };
  }

  // Géneros favoritos: solo letras, comas, espacios y formato correcto
  private generosFavoritosValidator(): ValidatorFn {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ ,]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor || valor.length === 0) return null;
      const joined = Array.isArray(valor) ? valor.join(',') : valor;
      if (!regex.test(joined)) {
        return { caracteresInvalidos: true };
      }
      // No permitir dobles comas ni géneros vacíos
      const generos = joined.split(',').map((g: string) => g.trim());
      if (generos.some((g: string) => !g)) {
        return { formatoIncorrecto: true };
      }
      return null;
    };
  }

  // Fecha de nacimiento: no futura
  private fechaNoFuturaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const hoy = new Date();
      const val = new Date(control.value);
      return val > hoy ? { fechaFutura: true } : null;
    };
  }

  // ========== FIN VALIDADORES PERSONALIZADOS ==========

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      biografia: [
        this.usuario.biografia || '',
        [
          Validators.maxLength(500),
          this.biografiaValidator()
        ]
      ],
      fecha_nacimiento: [
        this.usuario.fecha_nacimiento || '',
        [this.fechaNoFuturaValidator()]
      ],
      pais: [
        this.usuario.pais || '',
        [this.soloLetrasEspaciosValidator()]
      ],
      ciudad: [
        this.usuario.ciudad || '',
        [this.soloLetrasEspaciosValidator()]
      ],
      generos_favoritos: [
        this.usuario.generos_favoritos
          ? this.usuario.generos_favoritos.split(',').map(g => g.trim())
          : [],
        [this.generosFavoritosValidator()]
      ],
      avatar: [null]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => this.usuario.avatar = reader.result as string;
    reader.readAsDataURL(this.selectedFile);
  }

  guardarCambios(): void {
    if (!this.isOwner) return;
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) return;

    const data = new FormData();
    Object.entries(this.formulario.value).forEach(([key, val]) => {
      if (val && key !== 'avatar') {
        data.append(key,
          Array.isArray(val) ? val.join(', ') : val.toString()
        );
      }
    });
    if (this.selectedFile) {
      data.append('avatar', this.selectedFile);
    }

    this.api.actualizarPerfil(data)
      .subscribe({
        next: () => {
          this.modoEdicion = false;
          this.fetchTarget();
        },
        error: () => {
        }
      });
  }

  onPaypalAprobado(event: { orderID: string }) {
    this.api.capturarYCrearSuscripcion({ orderID: event.orderID })
      .subscribe({
        next: res => {
          this.msj.mostrar('¡Pago realizado con éxito!', 'success');
          if (res.factura?.pdf_url) {
            this.facturaPdfUrl = res.factura.pdf_url;
          }
          this.ngOnInit();
        },
        error: () => {
          this.msj.mostrar('No se pudo activar la suscripción', 'danger');
        }
      });
  }

  descargarFactura(): void {
    if (!this.facturaPdfUrl) return;
  
    // Extraer el nombre base del archivo (último segmento de la URL)
    const partes = this.facturaPdfUrl.split('/');
    const nombreArchivoBase = partes[partes.length - 1];
    const nombreArchivoConExtension = `${nombreArchivoBase}.pdf`;
  
    fetch(this.facturaPdfUrl)
      .then(response => {
        if (!response.ok) throw new Error('Error al descargar el PDF');
        return response.blob();
      })
      .then(blob => {
        const urlBlob = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = nombreArchivoConExtension;  // nombre + .pdf
        link.click();
        window.URL.revokeObjectURL(urlBlob);
      })
      .catch(() => {
        this.msj.mostrar('Error al descargar la factura', 'danger');
      });
  }
}
