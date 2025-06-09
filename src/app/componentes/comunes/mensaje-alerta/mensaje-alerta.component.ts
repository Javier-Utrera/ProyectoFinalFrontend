import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
import { Modal } from 'bootstrap';
import { MensajeGlobalService, ModalConfig } from '../../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-mensaje-alerta',
  imports: [],
  templateUrl: './mensaje-alerta.component.html',
  styleUrl: './mensaje-alerta.component.css'
})
export class MensajeAlertaComponent implements OnInit, OnDestroy {
  @ViewChild('modal', { static: true }) modalEl!: ElementRef<HTMLDivElement>;
  private bsModal!: Modal;
  private sub!: Subscription;
  config: ModalConfig | null = null;

  constructor(private msj: MensajeGlobalService) {}

  ngOnInit() {
    // Sin backdrop, sin oscurecer fondo
    this.bsModal = new Modal(this.modalEl.nativeElement, { backdrop: false, keyboard: false });

    this.sub = this.msj.modalState$.subscribe(cfg => {
      if (!cfg?.isConfirm) return;   // Solo confirmaciones
      this.config = cfg;
      this.bsModal.show();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.bsModal.dispose();
  }

  cerrar() { this.bsModal.hide(); }
  aceptar() {
    this.config?.resolver?.(true);
    this.bsModal.hide();
  }
  cancelar() {
    this.config?.resolver?.(false);
    this.bsModal.hide();
  }

  /** Añade la clase 'confirm' al host si es confirmación */
  @HostBinding('class.confirm') get isConfirm() {
    return this.config?.isConfirm === true;
  }
}
