import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCodeComponent } from './transfer-code.component';

describe('TransferCodeComponent', () => {
  let component: TransferCodeComponent;
  let fixture: ComponentFixture<TransferCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
