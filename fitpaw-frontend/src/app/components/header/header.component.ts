import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    //dont scroll body when menu is open
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

}
