import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosBloqueadosComponent } from './usuarios-bloqueados.component';

describe('UsuariosBloqueadosComponent', () => {
  let component: UsuariosBloqueadosComponent;
  let fixture: ComponentFixture<UsuariosBloqueadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosBloqueadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosBloqueadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
