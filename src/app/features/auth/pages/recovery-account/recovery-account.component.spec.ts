import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryAccountComponent } from './recovery-account.component';

describe('RecoveryAccountComponent', () => {
  let component: RecoveryAccountComponent;
  let fixture: ComponentFixture<RecoveryAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
