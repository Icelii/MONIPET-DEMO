import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  randomImage: string = '';

  private images: string[] = [
    'https://monipetresources.sfo3.digitaloceanspaces.com/web/images/wenomechainsama.svg',
    'https://monipetresources.sfo3.digitaloceanspaces.com/web/images/intelligentDog.svg',
    'https://monipetresources.sfo3.digitaloceanspaces.com/web/images/cat.svg',
    'https://monipetresources.sfo3.digitaloceanspaces.com/web/images/catDog.svg',
  ];

  ngOnInit() {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    this.randomImage = this.images[randomIndex];
  }
}
