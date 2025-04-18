import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';

import { PerfilComponent } from './paginas/perfil/perfil.component';

import { CrearRelatoComponent } from './paginas/relatos/crear-relato/crear-relato.component';
import { MisRelatosComponent } from './paginas/relatos/mis-relatos/mis-relatos.component';
import { RelatosPublicadosComponent } from './paginas/relatos/relatos-publicados/relatos-publicados.component';
import { VerRelatoComponent } from './paginas/relatos/ver-relato/ver-relato.component';
import { EditarRelatoComponent } from './paginas/relatos/editar-relato/editar-relato.component';
import { RelatosDisponiblesComponent } from './paginas/relatos/relatos-disponibles/relatos-disponibles.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  { path: 'perfil', component: PerfilComponent },

  { path: 'crear-relato', component: CrearRelatoComponent },
  { path: 'mis-relatos', component: MisRelatosComponent },
  { path: 'relatos-publicados', component: RelatosPublicadosComponent },
  { path: 'relato/:id', component: VerRelatoComponent },
  { path: 'relato/:id/editar', component: EditarRelatoComponent },
  { path: 'relatos-disponibles', component: RelatosDisponiblesComponent },

  { path: '**', redirectTo: '' },
];

export const routing = provideRouter(routes);
