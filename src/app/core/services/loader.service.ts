import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private requestCount = 0;
  isLoading = signal<boolean>(false);

  constructor() { }

  public hide(){
    this.requestCount = Math.max(this.requestCount - 1, 0);
    if (this.requestCount === 0) {
      this.isLoading.set(false);
    }
  }

  public show(){
    this.requestCount++;
    this.isLoading.set(true);
  }
}
