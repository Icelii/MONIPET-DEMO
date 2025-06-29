import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { timer, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-count-down',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './count-down.component.html',
  styleUrl: './count-down.component.css'
})
export class CountDownComponent implements OnInit, OnDestroy {
  @Input() duration: number = 300;
  @Output() finished = new EventEmitter<void>();

  formattedTime: string = '';
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) {
      this.formattedTime = this.formatTime(this.duration);
      return;
    }

    timer(0, 1000).pipe(
      takeUntil(this.destroy$),
      map(tick => this.duration - tick)
    ).subscribe(remaining => {
      if (remaining >= 0) {
        this.formattedTime = this.formatTime(remaining);
      } else {
        this.finished.emit();
        this.destroy$.next();
      }
    });
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
