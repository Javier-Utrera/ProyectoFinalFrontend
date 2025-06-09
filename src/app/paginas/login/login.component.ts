import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authServiceApi: AutenticacionService,
    public router: Router,
    private route: ActivatedRoute,
    private googleAuth: AuthService
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Inicializa el botón de Google
    this.googleAuth.initGoogleButton('googleButton', (response: any) => {
      const idToken = response.credential;
      this.authServiceApi.loginWithGoogle(idToken).subscribe({
        next: () => this.redirigir(),
        error: () => {}
      });
    });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.authServiceApi.loginUsuario(this.formulario.value).subscribe({
      next: () => this.redirigir(),
      error: () => {}
    });
  }

  private redirigir() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.router.navigateByUrl(returnUrl ?? '/');
  }
}
