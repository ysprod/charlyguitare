import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VertComponent } from './vert.component';

describe('VertComponent', () => {
  let component: VertComponent;
  let fixture: ComponentFixture<VertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
