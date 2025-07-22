import { TestBed } from '@angular/core/testing';

import { ConfirmAlertService } from './confirm-alert.service';

describe('ConfirmAlertService', () => {
  let service: ConfirmAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
