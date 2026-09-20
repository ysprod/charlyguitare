import { TestBed } from '@angular/core/testing';

import { RedirectLoggedInGuard } from './redirect-logged-in.guard';

describe('RedirectLoggedInGuard', () => {
  let guard: RedirectLoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RedirectLoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
