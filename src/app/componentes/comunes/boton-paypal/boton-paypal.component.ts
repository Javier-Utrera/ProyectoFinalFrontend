import { Component, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../servicios/api-servicios/api.service';

@Component({
  selector: 'app-boton-paypal',
  imports: [],
  templateUrl: './boton-paypal.component.html',
  styleUrl: './boton-paypal.component.css'
})
export class BotonPaypalComponent implements AfterViewInit {
  @Output() pagoAprobado = new EventEmitter<{ orderID: string }>();
  @Output() errorPago = new EventEmitter<any>();
  elementId = 'paypal-btn-' + Math.floor(Math.random() * 100000);

  constructor(private api: ApiService) {}

  ngAfterViewInit() {
    // Cuando se carga el botón, primero pido la orden al backend
    // y luego configuro el botón
    this.api.crearOrdenPaypal().subscribe({
      next: (res) => {
        // @ts-ignore
        window.paypal.Buttons({
          createOrder: () => res.orderID,
          onApprove: (data: any) => {
            this.pagoAprobado.emit({ orderID: data.orderID });
          },
          onError: (err: any) => {
            this.errorPago.emit(err);
          }
        }).render('#' + this.elementId);
      },
      error: (err) => {
        this.errorPago.emit(err);
      }
    });
  }
}
