import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonPaypalComponent } from './boton-paypal.component';

describe('BotonPaypalComponent', () => {
  let component: BotonPaypalComponent;
  let fixture: ComponentFixture<BotonPaypalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonPaypalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonPaypalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
