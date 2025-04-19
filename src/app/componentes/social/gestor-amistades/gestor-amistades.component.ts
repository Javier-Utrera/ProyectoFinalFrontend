import { Component } from '@angular/core';
import { ListaAmigosComponent } from "../lista-amigos/lista-amigos.component";
import { SolicitudesRecibidasComponent } from "../solicitudes-recibidas/solicitudes-recibidas.component";
import { SolicitudesEnviadasComponent } from "../solicitudes-enviadas/solicitudes-enviadas.component";
import { BuscadorUsuariosComponent } from "../buscador-usuarios/buscador-usuarios.component";
import { UsuariosBloqueadosComponent } from "../usuarios-bloqueados/usuarios-bloqueados.component";

@Component({
  selector: 'app-gestor-amistades',
  imports: [ListaAmigosComponent, SolicitudesRecibidasComponent, SolicitudesEnviadasComponent, BuscadorUsuariosComponent, UsuariosBloqueadosComponent],
  templateUrl: './gestor-amistades.component.html',
  styleUrl: './gestor-amistades.component.css'
})
export class GestorAmistadesComponent {
  tab: 'amigos' | 'recibidas' | 'enviadas' | 'buscar' | 'bloqueados' = "amigos";
}
