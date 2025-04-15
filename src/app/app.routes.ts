import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';

import { PerfilComponent } from './paginas/perfil/perfil.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  { path: 'perfil', component: PerfilComponent },
  { path: '**', redirectTo: '' },
];

export const routing = provideRouter(routes);
