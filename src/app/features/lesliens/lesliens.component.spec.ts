import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LesliensComponent } from './lesliens.component';

describe('LesliensComponent', () => {
  let component: LesliensComponent;
  let fixture: ComponentFixture<LesliensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LesliensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LesliensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
