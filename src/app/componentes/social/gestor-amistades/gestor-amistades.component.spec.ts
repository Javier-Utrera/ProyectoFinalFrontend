import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorAmistadesComponent } from './gestor-amistades.component';

describe('GestorAmistadesComponent', () => {
  let component: GestorAmistadesComponent;
  let fixture: ComponentFixture<GestorAmistadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestorAmistadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestorAmistadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
