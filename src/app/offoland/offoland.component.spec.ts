import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffolandComponent } from './offoland.component';

describe('OffolandComponent', () => {
  let component: OffolandComponent;
  let fixture: ComponentFixture<OffolandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffolandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffolandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
