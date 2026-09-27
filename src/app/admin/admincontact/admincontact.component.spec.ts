import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/game/lykomode/lykomode.component.spec.ts
import { LykomodeComponent } from './lykomode.component';

describe('LykomodeComponent', () => {
  let component: LykomodeComponent;
  let fixture: ComponentFixture<LykomodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LykomodeComponent ]
========
import { AdmincontactComponent } from './admincontact.component';

describe('AdmincontactComponent', () => {
  let component: AdmincontactComponent;
  let fixture: ComponentFixture<AdmincontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmincontactComponent ]
>>>>>>>> 6959cce1417468aab288e12bc60fbfd7a81b8dbd:src/app/admin/admincontact/admincontact.component.spec.ts
    })
    .compileComponents();
  });

  beforeEach(() => {
<<<<<<<< HEAD:src/app/game/lykomode/lykomode.component.spec.ts
    fixture = TestBed.createComponent(LykomodeComponent);
========
    fixture = TestBed.createComponent(AdmincontactComponent);
>>>>>>>> 6959cce1417468aab288e12bc60fbfd7a81b8dbd:src/app/admin/admincontact/admincontact.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
