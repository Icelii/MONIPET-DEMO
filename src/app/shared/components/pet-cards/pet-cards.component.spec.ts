import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetCardsComponent } from './pet-cards.component';

describe('PetCardsComponent', () => {
  let component: PetCardsComponent;
  let fixture: ComponentFixture<PetCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
