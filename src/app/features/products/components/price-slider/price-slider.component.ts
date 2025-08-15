import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-price-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './price-slider.component.html',
  styleUrl: './price-slider.component.css',
})
export class PriceSliderComponent implements AfterViewInit {
  @ViewChild('inputLeft') inputLeft!: ElementRef<HTMLInputElement>;
  @ViewChild('inputRight') inputRight!: ElementRef<HTMLInputElement>;
  @ViewChild('range') range!: ElementRef<HTMLElement>;
  @Output() priceChange = new EventEmitter<[number, number]>();

  minValue = 200;
  maxValue = 800;
  leftPercent = 20;
  rightPercent = 80;
  minGap = 150;

  ngAfterViewInit() {
    const inputLeft = this.inputLeft.nativeElement;
    const inputRight = this.inputRight.nativeElement;
    const range = this.range.nativeElement;

    const setLeftValue = () => {
      const min = parseInt(inputLeft.min);
      const max = parseInt(inputLeft.max);
      const rightVal = parseInt(inputRight.value);

      let newLeft = Math.min(parseInt(inputLeft.value), rightVal - this.minGap);
      newLeft = Math.max(min, newLeft);

      this.minValue = newLeft;
      inputLeft.value = newLeft.toString();

      const percent = ((newLeft - min) / (max - min)) * 100;
      this.leftPercent = percent;
      range.style.left = `${percent}%`;
       this.emitPriceChange();
    };

    const setRightValue = () => {
      const min = parseInt(inputRight.min);
      const max = parseInt(inputRight.max);
      const leftVal = parseInt(inputLeft.value);

      let newRight = Math.max(parseInt(inputRight.value), leftVal + this.minGap);
      newRight = Math.min(max, newRight);

      this.maxValue = newRight;
      inputRight.value = newRight.toString();

      const percent = ((newRight - min) / (max - min)) * 100;
      this.rightPercent = percent;
      range.style.right = `${100 - percent}%`;
      this.emitPriceChange();
    };

    inputLeft.addEventListener('input', setLeftValue);
    inputRight.addEventListener('input', setRightValue);

    setLeftValue();
    setRightValue();
  }

  private emitPriceChange() {
    this.priceChange.emit([this.minValue, this.maxValue]);
  }
}
