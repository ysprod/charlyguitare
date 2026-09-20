import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GardienComponent } from './gardien.component';

describe('GardienComponent', () => {
  let component: GardienComponent;
  let fixture: ComponentFixture<GardienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GardienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GardienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
