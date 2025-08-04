import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { tokenDashboardGuard } from './token-dashboard.guard';

describe('tokenDashboardGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => tokenDashboardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
