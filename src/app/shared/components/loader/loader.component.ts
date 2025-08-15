import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  private readonly loaderService = inject(LoaderService);

  isLoading = this.loaderService.isLoading;
}
