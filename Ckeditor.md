# Integración personalizada de CKEditor 5 en Angular (mi forma de hacerlo)

Este tutorial explica paso a paso lo que hice para integrar CKEditor 5 en mi proyecto **The Book Room**, sin usar builds del builder web ni versiones con restricciones de licencia. Todo es gratuito y personalizado, usando plugins seleccionados a mano.

---

## 1. Clonar la build base de CKEditor 5

Primero cloné la build oficial decoupled-document desde GitHub. Esta build sirve como base para personalizar el editor a mi gusto.

```bash
git clone https://github.com/ckeditor/ckeditor5-build-decoupled-document.git ckeditor5-custom
cd ckeditor5-custom
```

---

## 2. Instalar dependencias sin conflictos

Como algunas versiones tienen problemas entre paquetes, usé `--legacy-peer-deps`:

```bash
npm install --legacy-peer-deps
```

---

## 3. Elegir plugins gratuitos y configurar el editor

Modifiqué el archivo `src/ckeditor.js`. Añadí plugins gratuitos que me interesaban:

```js
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
// etc.

DecoupledEditor.builtinPlugins = [
  Essentials,
  Alignment,
  FontSize,
  // y todos los demás plugins que quiero usar
];
```

Al final del archivo puse esto para exponer el editor:

```js
window.DecoupledEditor = DecoupledEditor;
```

---

## 4. Compilar el editor

Lanzé el build:

```bash
npm run build
```

Esto me generó:

* `build/ckeditor.js`
* `build/ckeditor.js.map`
* `build/translations/`

---

## 5. Copiar los archivos al proyecto Angular

Dentro del frontend, creé una carpeta en `assets`:

```bash
mkdir -p src/assets/ckeditor
```

Y copé los archivos:

```bash
cp build/ckeditor.js build/ckeditor.js.map -r build/translations src/assets/ckeditor/
```

---

## 6. Crear componente Angular para usar el editor

Hice un componente llamado `EditorComponent` que:

* Carga el script solo una vez.
* Inicializa `DecoupledEditor` en un `div` cuando está cargado.
* Inserta la toolbar en el sitio correcto.
* Enlaza el contenido con `[(model)]` para poder usarlo fácilmente.
* Destruye el editor si se cierra el componente, para evitar errores de carga doble.

---

## 7. Usar el editor en otros componentes

Desde cualquier componente como `editar-relato`, simplemente lo uso así:

```html
<app-editor [(model)]="contenidoHtml"></app-editor>
```

Y ya tengo el editor funcionando con estilos, funcionalidades completas y sin depender de builds que caducan o que requieren licencia.

---

## Notas finales

* Todos los plugins que usé son gratuitos.
* No uso el componente oficial de Angular porque tiene problemas con versiones personalizadas.
* Todo está optimizado para que no haya errores de módulos duplicados ni conflictos.

---

>>> 
---

## Transición a edición colaborativa con TipTap + Yjs

Después de destruirme la cabeza integrando CKEditor con una build personalizada, logré que funcionara correctamente para campos enriquecidos como la biografía.
Sin embargo, me di cuenta de que **no ofrece soporte gratuito para colaboración en tiempo real**, que es **justamente lo que necesito** para la edición colaborativa de relatos.

### Decisión tomada

* **CKEditor se mantiene** únicamente para campos simples, como:

  ```python
  biografia = models.TextField(blank=True, null=True)
  ```

  donde no necesito sincronización entre usuarios.

* Para la **edición colaborativa de relatos**, he decidido migrar hacia una arquitectura moderna basada en:

  * **Frontend**: TipTap (editor modular basado en ProseMirror)
  * **Colaboración**: Yjs (CRDT para sincronización en tiempo real)
  * **Backend**: Django Channels con WebSockets

---

### Backend: Django Channels + WebSocket para colaboración

He integrado correctamente Django Channels en el backend.
Esto me permite abrir conexiones WebSocket y mantenerlas vivas para que múltiples usuarios puedan editar simultáneamente el contenido de un relato.

#### Ruta WebSocket

```
ws://localhost:8000/ws/relato/<relato_id>/
```

Cada relato se identifica por su ID y tiene su propio canal de comunicación.

#### Lógica del consumidor (WebSocket)

He creado un `YjsDocumentConsumer` que:

* Se conecta a una sala según el ID del relato.
* Acepta y reenvía mensajes binarios de Yjs (necesarios para sincronización).
* Se encarga de conectar/desconectar a los usuarios del grupo correspondiente.

---

### Siguiente paso: frontend TipTap + Yjs

En el frontend planeo usar TipTap conectado al backend por WebSocket para permitir que varios autores editen en tiempo real el contenido del relato.

Cada relato tendrá su propia instancia de `Y.Doc` sincronizada automáticamente entre los participantes.

Esto sí será una colaboración real.

