import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharlyguitaregameComponent } from './charlyguitaregame.component';

describe('CharlyguitaregameComponent', () => {
  let component: CharlyguitaregameComponent;
  let fixture: ComponentFixture<CharlyguitaregameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharlyguitaregameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharlyguitaregameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
