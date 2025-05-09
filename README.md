# The Book Room – Frontend

Este repositorio contiene el frontend de la aplicación **The Book Room**, desarrollado con **Angular 17+**. Proporciona una interfaz web que permite registrarse, iniciar sesión, colaborar en relatos, editar su perfil y explorar relatos publicados.

---

## Estructura del proyecto

src/
 app/
    componentes/
        barra-navegacion
        comunes/
            mensaje-alerta
        editor           
        pie-pagina
        social/
            buscador-usuarios
            gestor-amistades(Gestiona los demas componentes de social)
            lista-amigos
            solicitudes-enviadas
            solicitudes-recibidas
            usuarios-bloqueados
    paginas/
        inicio       
        perfil      
        registro 
        relatos/
            crear-relato
            editar-relato
            mis-relatos
            relatos-disponibles
            relatos-publicados
            ver-relato
    servicios/
        api-autenticacion
        api-servicios
        mensaje-global

---

## Servicios

### `api.service.ts` – Servicio general para llamadas a la APIREST

Contiene métodos para comunicarse con el backend. Añade automáticamente el token `Bearer` en las cabeceras de las peticiones que tienen que ser autenticaadas

#### Perfil de usuario
- `obtenerPerfil()` – `GET /api/perfil/`
- `actualizarPerfil(datos)` – `PATCH /api/perfil/`

#### Relatos
- `getRelatosPublicados()` – `GET /api/relatos/publicados/`
- `getMisRelatos()` – `GET /api/relatos/`
- `getRelatoPorId(id)` – `GET /api/relatos/<id>/`
- `crearRelato(datos)` – `POST /api/relatos/crear/`
- `editarRelato(id, datos)` – `PATCH /api/relatos/<id>/editar/`
- `eliminarRelato(id)` – `DELETE /api/relatos/<id>/eliminar/`
- `marcarRelatoListo(id)` – `POST /api/relatos/<id>/marcar-listo/`
- `getRelatosAbiertos()` – `GET /api/relatos/abiertos/`
- `unirseARelato(id)` – `POST /api/relatos/<id>/unirse/`

#### Social
- `getAmigos()` – `GET /api/amigos/`
- `getSolicitudesRecibidas()` – `GET /api/amigos/recibidas/`
- `getSolicitudesEnviadas()` – `GET /api/amigos/enviadas/`
- `enviarSolicitudAmistad(usuarioId)` – `POST /api/amigos/enviar/`
- `aceptarSolicitudAmistad(solicitudId)` – `POST /api/amigos/aceptar/<id>/`
- `bloquearSolicitudAmistad(solicitudId)` – `POST /api/amigos/bloquear/<id>/`
- `getUsuariosBloqueados()` – `GET /api/amigos/bloqueados/`
- `desbloquearUsuario(usuarioId)` – `DELETE /api/amigos/desbloquear/<id>/`
- `eliminarAmigo(usuarioId)` – `DELETE /api/amigos/eliminar/<id>/`

#### Usuarios
- `buscarUsuarios(termino)` – `GET /api/usuarios/buscar/?q=<termino>`
---

### `autenticacion.service.ts` – Servicio de sesión y autenticación

Gestiona el login, logout, registro y estado de sesión del usuario.

- `registrarUsuario(data)` – `POST /api/registro/`
- `loginUsuario(data)` – `POST /api/login/`
- `logoutUsuario()` – `POST /api/logout/`
- `cerrarSesion()` – Limpia el token local y cambia el estado
- `obtenerToken()` – Devuelve el token actual
- `estado$` – Observable con el estado de autenticación (true/false)

---

### `mensaje.global.service.ts` – Servicio de mensajes emergentes

Permite mostrar mensajes temporales (modal de boostrap) a través de un observable.

- `mostrar(mensaje: string,tipo string)` – Muestra un mensaje durante 1.5 segundos

---

## Componentes

### `barra-navegacion`
- Menú de navegación principal
- Muestra botones diferentes según el estado de sesión

### `mensaje-alerta`
- Modal genérico reutilizable para mostrar mensajes (éxito, error, info)

### `pie-pagina`
- Pie de página de la aplicación

### Componentes sociales (`/componentes/social/`)

#### `gestor-amistades`
- Componente principal de gestión social
- Contiene las pestañas para acceder a amigos, solicitudes y bloqueos

#### `buscador-usuarios`
- Permite buscar usuarios por nombre
- Ofrece botón para enviar solicitud de amistad

#### `lista-amigos`
- Muestra la lista de amigos actuales del usuario
- Incluye opción para eliminar amistad

#### `solicitudes-enviadas`
- Lista de solicitudes enviadas por el usuario
- Muestra estado y permite cancelar o bloquear

#### `solicitudes-recibidas`
- Lista de solicitudes pendientes recibidas
- Permite aceptar o bloquear al usuario

#### `usuarios-bloqueados`
- Lista de usuarios bloqueados
- Incluye opción para desbloquearlos

---

## Gestión de sesión

- Al registrarse o iniciar sesión, el backend devuelve un token `access_token` que se guarda en `localStorage`.
- Este token se incluye automáticamente en las peticiones autenticadas desde `ApiService`.
- El logout borra el token y redirige al usuario a la pantalla inicial.
- El estado de sesión se gestiona con un `BehaviorSubject` expuesto como observable (`estado$`).

---

## Funcionalidades por página

### `registro`
- Formulario para crear cuenta de usuario
- Valida campos y muestra mensajes de error bajo cada uno
- Muestra modal de éxito al finalizar

### `login`
- Formulario de autenticación
- Guarda el token y redirige al perfil si es correcto

### `perfil`
- Muestra datos del usuario autenticado
- Permite editar: biografía, ciudad, país, fecha de nacimiento, géneros favoritos y avatar
- Gestiona todo lo referente al apartado social de la aplicacion

### `crear-relato`
- Crea un nuevo relato colaborativo
- El creador es automáticamente el primer participante

### `editar-relato`
- Permite modificar un relato si el usuario es colaborador
- Se puede marcar como "listo para publicar"

### `mis-relatos`
- Lista los relatos en los que participa el usuario actual

### `relatos-publicados`
- Página pública para visualizar relatos ya finalizados

### `relatos-disponibles`
- Muestra relatos en estado `CREACION` que aún admiten más escritores
- Los usuarios pueden unirse a ellos si estan logueados, si no lo estan, los redirige a la pantalla de login

### `ver-relato`
- Lectura completa de un relato

---

## Comunicación con el backend

- Todos los endpoints están documentados en el backend: [BookRoom API REST](https://github.com/Javier-Utrera/ProyectoFinalBackend)
- Las peticiones autenticadas usan el token Bearer (Oauth2)

---


## Nuevos componentes: Comentarios y Valoración

- ### ComentariosComponent
  - Uso: `<app-comentarios [relatoId]="relato.id"></app-comentarios>`
  - Gestiona carga y creación de comentarios vía API.
  - Usando la bandera hasComentado, controlo si el usuario ya ha votado en el relato, en ese caso le desabilito la opcion de poder crear un comentario nuevo y en su lugar le indico que ya 
    ha comentado. Dejandole solo la opcion de editar su comentario o barrarlo.

- ### PuntuacionComponent
  - Uso: `<app-puntuacion [relatoId]="relato.id"></app-puntuacion>`
  - Hover interactivo y modificación de voto (update_or_create).

- #### Integración en VerRelatoComponent:
  imports: [ComentariosComponent, PuntuacionComponent]

#### Mensajes globales con `MensajeGlobalService` en el componente padre para alertas.

---

# Generado por angular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
