import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeAlertaComponent } from './mensaje-alerta.component';

describe('MensajeAlertaComponent', () => {
  let component: MensajeAlertaComponent;
  let fixture: ComponentFixture<MensajeAlertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeAlertaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajeAlertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
