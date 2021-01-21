import { TestBed } from '@angular/core/testing';

import { AdminPrivileges } from './can-activate.guard';

describe('CanActivateGuard', () => {
  let guard: AdminPrivileges;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminPrivileges);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
