import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonAccountVerifyComponent } from './button-account-verify.component';

describe('ButtonAccountVerifyComponent', () => {
  let component: ButtonAccountVerifyComponent;
  let fixture: ComponentFixture<ButtonAccountVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonAccountVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonAccountVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
