import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { MensajeAlertaComponent } from '../../componentes/comunes/mensaje-alerta/mensaje-alerta.component';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule,MensajeAlertaComponent],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  formulario!: FormGroup;
  erroresBack: Record<string, string> = {};

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router,
    public mensajeGlobal: MensajeGlobalService
  ) {}

  ngOnInit(): void {
    this.mensajeGlobal.limpiar();
    this.formulario = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.erroresBack = {};
    if (!this.formulario.valid) return;

    this.authService.registrarUsuario(this.formulario.value).subscribe({
      next: (res) => {
        console.log('RESPUESTA:', res)
        const username = res.user.username;
        this.router.navigate(['/']);
      },
      error: (err) => {
        //Error en el servidor
        if (err.status === 400) {
          Object.entries(err.error).forEach(([campo, mensajes]) => {
            this.erroresBack[campo] = Array.isArray(mensajes) ? mensajes[0] : mensajes;
          });
        } else {
          //Error en la API
          console.error('Error en el servidor:', err);
          this.mensajeGlobal.mostrar(err.error?.error || 'Error en el servidor', 'danger');
        }
      }
    });
  }
}
