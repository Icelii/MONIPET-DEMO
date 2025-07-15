import { TestBed } from '@angular/core/testing';

import { EmailAlertService } from './email-alert.service';

describe('EmailAlertService', () => {
  let service: EmailAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
