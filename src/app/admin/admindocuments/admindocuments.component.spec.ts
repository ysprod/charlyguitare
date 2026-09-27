import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmindocumentsComponent } from './admindocuments.component';

describe('AdmindocumentsComponent', () => {
  let component: AdmindocumentsComponent;
  let fixture: ComponentFixture<AdmindocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmindocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmindocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
