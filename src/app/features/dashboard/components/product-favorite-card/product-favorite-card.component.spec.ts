import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFavoriteCardComponent } from './product-favorite-card.component';

describe('ProductFavoriteCardComponent', () => {
  let component: ProductFavoriteCardComponent;
  let fixture: ComponentFixture<ProductFavoriteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFavoriteCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFavoriteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
