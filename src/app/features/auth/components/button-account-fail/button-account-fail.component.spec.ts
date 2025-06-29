import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonAccountFailComponent } from './button-account-fail.component';

describe('ButtonAccountFailComponent', () => {
  let component: ButtonAccountFailComponent;
  let fixture: ComponentFixture<ButtonAccountFailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonAccountFailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonAccountFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
