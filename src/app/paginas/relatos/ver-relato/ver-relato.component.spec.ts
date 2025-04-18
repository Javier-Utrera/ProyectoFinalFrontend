import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRelatoComponent } from './ver-relato.component';

describe('VerRelatoComponent', () => {
  let component: VerRelatoComponent;
  let fixture: ComponentFixture<VerRelatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerRelatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerRelatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
