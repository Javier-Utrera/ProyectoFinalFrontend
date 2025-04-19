import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { MensajeAlertaComponent } from '../../componentes/comunes/mensaje-alerta/mensaje-alerta.component';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,MensajeAlertaComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formulario!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AutenticacionService, private router: Router, private route: ActivatedRoute,public mensajeGlobal: MensajeGlobalService) { }

  ngOnInit(): void {
    this.mensajeGlobal.limpiar();
    this.formulario = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      const username = this.formulario.value.username;

      this.authService.loginUsuario(this.formulario.value).subscribe({
        next: (res) => {
          console.log('RESPUESTA:', res)
          const username = res.user.username;
          const returnUrl = this.route.snapshot.queryParamMap.get('returnTo');
          this.router.navigate([returnUrl || '/']);
        },
        error: (err) => {
          console.error('Error en el login:', err);
          this.mensajeGlobal.mostrar(err.error?.error || 'Error al aceptar la solicitud', 'danger');
        }
      });
    }
  }
}
