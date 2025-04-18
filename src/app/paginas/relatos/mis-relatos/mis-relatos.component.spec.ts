import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisRelatosComponent } from './mis-relatos.component';

describe('MisRelatosComponent', () => {
  let component: MisRelatosComponent;
  let fixture: ComponentFixture<MisRelatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisRelatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisRelatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
