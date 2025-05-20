import { Component, AfterViewInit } from '@angular/core';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { CommonModule } from '@angular/common';
declare var SwaggerUIBundle: any;
declare var SwaggerUIStandalonePreset: any;

@Component({
  selector: 'app-swagger-ui-component',
  imports: [CommonModule],
  templateUrl: './swagger-ui-component.component.html',
  styleUrl: './swagger-ui-component.component.css'
})
export class SwaggerDocsComponent implements AfterViewInit {
  isAdmin = false;

  constructor(
    private authService: AutenticacionService,
    private api: ApiService
  ) {
    this.isAdmin = this.authService.hasRole(1);
  }

  ngAfterViewInit(): void {
    if (!this.isAdmin) {
      return;
    }
    this.api.getSwaggerSpec().subscribe({
      next: spec => {
        SwaggerUIBundle({
          dom_id: '#swagger-ui-container',
          spec,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          layout: 'BaseLayout',
          docExpansion: 'none',
          requestInterceptor: (req:any) => {
            if (req.url.startsWith('http://')) {
              req.url = req.url.replace('http://', 'https://');
            }
            return req;
          }
        });
      },
      error: err => {
        console.error('No se pudo cargar swagger.json', err);
      }
    });
  }
}
