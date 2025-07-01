import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  showMenu = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn()
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  onSearch(query: string) {
    if (query.trim()) {
      this.router.navigate(['/explore'], { queryParams: { q: query } });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
