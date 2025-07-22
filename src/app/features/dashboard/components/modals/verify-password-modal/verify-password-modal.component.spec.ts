import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPasswordModalComponent } from './verify-password-modal.component';

describe('VerifyPasswordModalComponent', () => {
  let component: VerifyPasswordModalComponent;
  let fixture: ComponentFixture<VerifyPasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyPasswordModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
