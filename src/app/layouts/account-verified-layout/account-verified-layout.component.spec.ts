import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountVerifiedLayoutComponent } from './account-verified-layout.component';

describe('AccountVerifiedLayoutComponent', () => {
  let component: AccountVerifiedLayoutComponent;
  let fixture: ComponentFixture<AccountVerifiedLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountVerifiedLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountVerifiedLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
