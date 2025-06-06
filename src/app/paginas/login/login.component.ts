import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { MensajeAlertaComponent } from '../../componentes/comunes/mensaje-alerta/mensaje-alerta.component';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';
import { AuthService } from '../../servicios/auth.service';
import { environment } from '../../../environments/environment';


// Importa el AuthService que carga el SDK de Google

// Si tu backend está en otra URL, ajústala aquí o usa environment.backendUrl

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MensajeAlertaComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formulario!: FormGroup;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    private fb: FormBuilder,
    private authServiceApi: AutenticacionService,
    public router: Router,
    private route: ActivatedRoute,
    public mensajeGlobal: MensajeGlobalService,
    private googleAuth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.mensajeGlobal.limpiar();
    this.formulario = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Inicializa el botón de Google en el div con id="googleButton"
    this.googleAuth.initGoogleButton('googleButton', (response: any) => {
      const idToken = response.credential;
      // Aquí corregimos: pasamos idToken a loginWithGoogle, no el formulario
      this.authServiceApi.loginWithGoogle(idToken).subscribe({
        next: res => {
          console.log('RESPUESTA (Google):', res);
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigateByUrl(returnUrl ?? '/');
        },
        error: err => {
          console.error('Error en el login con Google:', err);
          this.mensajeGlobal.mostrar(
            err.error?.detail ?? 'Error al iniciar sesión con Google',
            'danger'
          );
        }
      });
    });
  }

  onSubmit(): void {
    this.mensajeGlobal.limpiar();
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    if (this.formulario.valid) {
      this.authServiceApi.loginUsuario(this.formulario.value).subscribe({
        next: res => {
          console.log('RESPUESTA:', res);
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigateByUrl(returnUrl ?? '/');
        },
        error: err => {
          console.error('Error en el login:', err);
          this.mensajeGlobal.mostrar(
            err.error?.error ?? 'Error al iniciar sesión',
            'danger'
          );
        }
      });
    }
  }
}
