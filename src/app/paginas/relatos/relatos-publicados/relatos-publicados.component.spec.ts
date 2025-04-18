import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatosPublicadosComponent } from './relatos-publicados.component';

describe('RelatosPublicadosComponent', () => {
  let component: RelatosPublicadosComponent;
  let fixture: ComponentFixture<RelatosPublicadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatosPublicadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatosPublicadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
