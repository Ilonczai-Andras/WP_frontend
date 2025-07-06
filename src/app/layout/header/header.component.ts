import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ProfileComponent } from '../../features/profile/profile.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, ProfileComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy  {
  isLoggedIn = false;
  showMenu = false;
  private authSub!: Subscription;


  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authSub = this.authService.loggedIn$.subscribe(
      (loggedIn) => (this.isLoggedIn = loggedIn)
    );
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
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
    this.router.navigate(['/home']);
  }
}
