# The Book Room: la biblioteca colaborativa
# 1.- Introducción: ¿Qué es The Book Room?

*The Book Room* es una **red social** que podríamos definir como **"un espacio para conectar lectores y escritores de todo el mundo"**. La idea original de esta aplicación no era más que la de poder ofrecer a todo el que quisiera un espacio de tranquilidad, relajación y lectura conectando a diferentes personas, colaborando entre otros miembros de la comunidad, y sobre todo, leyendo, votando y comentando tus relatos favoritos.

Lo que distingue a *The Book Room* de otras redes sociales y lo hace una experiencia única es que centra el foco en la comunicación a través de la creación colaborativa de relatos, donde tanto los escritores como los lectores (a través de votación y comentario) pueden participar.

# 2.- Configuración y despliegue
En este apartado vamos a desgranar paso a paso todos los conocimientos que consideramos necesarios para poder realizar la instalación de esta aplicación. Durante todo este índice, vamos a centrarnos en conocimientos más técnicos, desde lo más básico a lo más avanzado.
## Paso 1: Conocimientos básicos
Para poder utilizar esta aplicación, debemos entender su estructura. *The Book Room* usa tres contenedores dockerizados donde mantiene por separado sus tres capas principales: uno de ellos alberga la base de datos (MySQL), otro de ellos para Backend (una API Rest de Django que se encargará de surtir los endpoints) y otro para FrontEnd (un proyecto Angular). Estos contenedores deben comunicarse entre ellos para el correcto funcionamiento de la aplicación. 
## Paso 2: Enlace a las imágenes Docker y repositorio GitHub. Requisitos de instalación.
Aquí facilitamos los enlaces para el contenedor de [BBDD](http://contenedor-bbdd.com), [Django](http://contenedor-bbdd.com) y [Angular](http://contenedor-angular.com), así como al repositorio de [GitHub](http://repositorio-git.com).

## Paso 3: Requisitos
En caso de querer acceder y editar el código fuente, las instalaciones necesarias en el sistema para poder proceder con la aplicación son las siguientes:
 - Docker
 - Docker Compose v2
 - Python
 - Django
 - Angular CLI (vía npx)
 - Node.js y npm
 - MySQL

 Una vez hayamos finalizado la instalación previa, podemos proceder con el despliegue paso a paso.


## Paso 4: Guía paso a paso

### Despliegue en local

#### Paso 1 Clonacion de repositorios: 
  - git clone https://github.com/Javier-Utrera/ProyectoFinalBackend.git
  - cd ProyectoFinalBackend

  - git clone https://github.com/Javier-Utrera/ProyectoFinalFrontend.git
  - cd ProyectoFinalFrontend
#### Paso 2 Levantar la base de datos local: 
  - Crea en la raíz de tu workspace un docker-compose.yml con solo la base de datos:

```
version: '3.8'
services:
  db:
    image: javierutrera/basededatos:latest
    container_name: mysql-local
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: thebookroom
      MYSQL_USER: javier
      MYSQL_PASSWORD: javierpass
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:

```
  - docker-compose up -d db

#### Paso 3 Backend en local: 

cd ProyectoFinalBackend

 - 1 Copiar ejemplo de .env y editar:
```
cp .env.example .env
 En .env:
   DJANGO_DEBUG=True
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DB=thebookroom
   MYSQL_USER=javier
   MYSQL_PASSWORD=javierpass
   CORS_ALLOWED_ORIGINS=http://localhost:4200
```

 - 2 Crear entorno Python e instalar dependencias:
```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

 - 3 Migrar y crear superusuario
```
python manage.py migrate
python manage.py createsuperuser
```

 - 4 Levantar servidor ASGI con Daphne :
```
daphne -b 0.0.0.0 -p 8000 app.asgi:application
```
 - El backend quedará disponible en http://localhost:8000/api/.
### Despliegue en PRODUCCIÓN (AWS EC2)

#### Paso 1: Base de datos en producción
  - Copia tu backup al servidor:
```
  scp -i ~/.ssh/tu_clave.pem backup_actualizado.sql ubuntu@IP_DB:/home/ubuntu/
```
  - Pull y despliegue del contenedor:
```
  Descargar la última imagen y levantar:
docker pull javierutrera/basededatos:latest
docker run -d \
  --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=thebookroom \
  -e MYSQL_USER=javier \
  -e MYSQL_PASSWORD=javierpass \
  -p 3306:3306 \
  -v db_data:/var/lib/mysql \
  javierutrera/basededatos:latest

Esperar unos segundos y restaurar:
docker cp backup_actualizado.sql mysql-db:/backup.sql
docker exec mysql-db bash -c "mysql -u root -proot thebookroom < /backup.sql"
```

#### Paso 2 Backend en producción: 
En la instancia backend-bookroom:
  - Crear el archivo de entorno /home/ubuntu/.env con estos valores (estos son los mios, ajusto con los tuyos):
```
DJANGO_SECRET_KEY=django-insecure-…
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=bookroom.duckdns.org
CORS_ALLOWED_ORIGINS=https://bookroom.duckdns.org
MYSQL_HOST=172.31.31.21
MYSQL_PORT=3306
MYSQL_DB=thebookroom
MYSQL_USER=javier
MYSQL_PASSWORD=javierpass
CLOUDINARY_CLOUD_NAME=…
CLOUDINARY_API_KEY=…
CLOUDINARY_API_SECRET=…
``` 
 - Desplegar el contenedor directamente desde Docker Hub:
``` 
Descargar la imagen y arrancar
docker pull javierutrera/backend:prod
docker run -d \
  --name backend-django \
  --env-file /home/ubuntu/.env \
  -p 8000:8000 \
  javierutrera/backend:prod
``` 
 - Comprobar que funciona:
```
docker logs -f backend-django
curl -I http://localhost:8000/api/
```
#### Paso 3 Frontend (Angular + Nginx + HTTPS):
En la instancia frontend-bookroom:
  - Pull y despliegue del contenedor:
```
docker pull javierutrera/frontend:prod
docker run -d \
  --name frontend-prod \
  -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  -v /home/ubuntu/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
  javierutrera/frontend:prod
```
  - Verificar:
```
docker logs -f frontend-prod
curl -I https://bookroom.duckdns.org
```

##### Archivo de ejemplo de como podria ser tu nginx.conf
Este es el nginx.conf base que montas en /home/ubuntu/nginx/nginx.conf para que tu contenedor Nginx sirva Angular y proxy al backend:

```
events {}

http {
    include       mime.types;
    default_type  application/octet-stream;

    # 1 Redirigir HTTP → HTTPS
    server {
        listen 80;
        server_name bookroom.duckdns.org;
        return 301 https://$host$request_uri;
    }

    # 2 Servidor HTTPS principal
    server {
        listen 443 ssl;
        server_name bookroom.duckdns.org;

        ssl_certificate     /etc/letsencrypt/live/bookroom.duckdns.org/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/bookroom.duckdns.org/privkey.pem;
        ssl_protocols       TLSv1.2 TLSv1.3;
        ssl_ciphers         HIGH:!aNULL:!MD5;

        root  /usr/share/nginx/html;
        index index.html;

        # SPA Angular
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Proxy a la API Django
        location /api/ {
            proxy_pass http://172.31.24.78:8000;
            proxy_set_header Host              $host;
            proxy_set_header X-Real-IP         $remote_addr;
            proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
            proxy_connect_timeout  60s;
            proxy_read_timeout     60s;
            proxy_send_timeout     60s;
        }

        # Cache para recursos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|eot)$ {
            expires 30d;
            access_log off;
        }
    }
}

```

# 3.- Resumen de comandos y scripts útiles
|                |Comando                          |Script que ejecuta|
|----------------|-------------------------------|-----------------------------|
|Levantar todo el entorno |`docker-compose up -d`            | Usa archivo docker-compose.yml (necesaria configuración)           
|Apagar y limpiar contenedores|`docker compose down`|Ninguno|

```markdown
** DOCKER-COMPOSE.YML **
**Es necesario revisar las rutas para adaptarlas a tus directorios, así como las credenciales de la BBDD. Del mismo modo, los puertos son configurables**
version: '3.8'
services:
db:
image: javierutrera/basededatos:latest
restart: always
container_name: mysql-db
environment:
MYSQL_ROOT_PASSWORD: root
MYSQL_DATABASE: thebookroom
MYSQL_USER: añadiruseraqui
MYSQL_PASSWORD: añadirpassaqui
ports:
- "3306:3306"
volumes:
- db_data:/var/lib/mysql
backend:
build: ./ProyectoFinalBackend
image: javierutrera/backend:latest
container_name: backend-django
volumes:
- ./ProyectoFinalBackend:/app
ports:
- "8000:8000"
depends_on:
- db
env_file:
- ./ProyectoFinalBackend/.env
frontend:
build: ./ProyectoFinalFrontend
image: javierutrera/frontend:latest
container_name: frontend-angular
volumes:
- ./ProyectoFinalFrontend:/usr/src/app
ports:
- "4200:4200"
volumes:
db_data:
```







# 4.- Mantenimiento y contribuciones
El desarrollo y la autoría de la aplicación ha sido llevada a cabo por [Javier-Utrera](https://github.com/Javier-Utrera) para su presentación como proyecto final para la obtención del título de Técnico Superior en Desarrollo de Aplicaciones Web, en el I.E.S. Polígono Sur, Sevilla. Su mantenimiento depende del mismo autor único. 

*The Book Room* es un proyecto que nace para finalizar un proceso de aprendizaje de dos años, y como tal, podríamos nombrar una larga lista de contribuciones en el ámbito de las pruebas: familiares, amigos y compañeros de clase y prácticas de empresa que han usado esta aplicaciones para dar *feedback* y opiniones desde el punto de vista del usuario que no son fáciles de detectar por el desarrollador.

# 5.- Licencia 
*The Book Room* se comparte bajo licencia ![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/CC_BY-SA_icon.svg/1024px-CC_BY-SA_icon.svg.png =55x20)Creative Commons CC BY-SA, lo que permite usar, modificar y distribuir su código (con fines comerciales o no), siempre que se cite al autor y las nuevas obras se licencien bajo estos mismos términos. Más información en [Creative Commons](https://creativecommons.org/licenses/by-sa/4.0/).



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
