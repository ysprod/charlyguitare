import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CinqComponent } from './cinq.component';

describe('CinqComponent', () => {
  let component: CinqComponent;
  let fixture: ComponentFixture<CinqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CinqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CinqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
