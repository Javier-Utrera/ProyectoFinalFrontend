import { Component } from '@angular/core';
import { ListaAmigosComponent } from "../lista-amigos/lista-amigos.component";
import { SolicitudesRecibidasComponent } from "../solicitudes-recibidas/solicitudes-recibidas.component";
import { SolicitudesEnviadasComponent } from "../solicitudes-enviadas/solicitudes-enviadas.component";
import { BuscadorUsuariosComponent } from "../buscador-usuarios/buscador-usuarios.component";
import { UsuariosBloqueadosComponent } from "../usuarios-bloqueados/usuarios-bloqueados.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestor-amistades',
  imports: [ListaAmigosComponent, SolicitudesRecibidasComponent, SolicitudesEnviadasComponent, BuscadorUsuariosComponent, UsuariosBloqueadosComponent,CommonModule],
  templateUrl: './gestor-amistades.component.html',
  styleUrls: ['./gestor-amistades.component.css']
})
export class GestorAmistadesComponent {
  tabs = [
    { key: 'buscar', label: 'Buscar usuarios' },
    { key: 'amigos', label: 'Amigos' },
    { key: 'recibidas', label: 'Solicitudes recibidas' },
    { key: 'enviadas', label: 'Solicitudes enviadas' },
    { key: 'bloqueados', label: 'Bloqueados' },
  ];
  tab = 'buscar';
  menuAbierto = false;
  
  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }
  
  seleccionarTab(key: string): void {
    this.tab = key;
    this.menuAbierto = false;
  }
}
