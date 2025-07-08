import { Component } from '@angular/core';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../shared/components/footer/footer.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NavBarComponent, RouterOutlet, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
