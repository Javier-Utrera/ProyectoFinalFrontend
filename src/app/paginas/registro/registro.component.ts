import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { MensajeService } from '../../servicios/mensaje.service';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  formulario!: FormGroup;
  erroresBack: Record<string, string> = {};

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private mensajeService: MensajeService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
        console.log('✅ RESPUESTA:', res)
        const username = res.user.username;
        this.mensajeService.mostrar(`¡Bienvenido, ${username}!`);
        this.router.navigate(['/']);
      },
      error: (err) => {
        //Error en el servidor
        if (err.status === 400) {
          Object.entries(err.error).forEach(([campo, mensajes]) => {
            this.erroresBack[campo] = Array.isArray(mensajes) ? mensajes[0] : mensajes;
          });
        } else {
          this.mensajeService.mostrar('Error inesperado al registrarse.');
        }
      }
    });
  }
}
