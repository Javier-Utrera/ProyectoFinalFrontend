import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { MensajeService } from '../../servicios/mensaje.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formulario!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AutenticacionService,private mensajeService: MensajeService, private router: Router) {}

  ngOnInit(): void {
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
          console.log('✅ RESPUESTA:', res)
          const username = res.user.username;
          this.mensajeService.mostrar(`¡Bienvenido, ${username}!`);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error en el login:', err);
          this.mensajeService.mostrar('Error al iniciar sesión');
        }
      });
    }
  }
}
