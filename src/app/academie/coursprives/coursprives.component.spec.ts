import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursprivesComponent } from './coursprives.component';

describe('CoursprivesComponent', () => {
  let component: CoursprivesComponent;
  let fixture: ComponentFixture<CoursprivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursprivesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursprivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
