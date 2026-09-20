import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KronosComponent } from './kronos.component';

describe('KronosComponent', () => {
  let component: KronosComponent;
  let fixture: ComponentFixture<KronosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KronosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KronosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
