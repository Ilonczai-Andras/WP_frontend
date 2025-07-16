import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { DropdownMenu } from '../../features/dropdown-menu/dropdown-menu';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ProfileService } from '../../core/services/profile.service';
import { UserDto } from '../../models/userDto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, DropdownMenu, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  showMenu = false;

  searchQuery: string = '';

  isSearchFocused: boolean = false;

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-wrapper')) {
      this.isSearchFocused = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.isSearchFocused = false;
  }

  searchResults: UserDto[] = [];
  searchSubject = new Subject<string>();

  private authSub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.profileService.searchUsers(query).subscribe((results) => {
          this.searchResults = results;
        });
      });
  }

  ngOnInit() {
    this.authSub = this.authService.loggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.isSearchFocused = false;
  }

  onSearch(query: string) {
    if (query.trim().length > 0) {
      this.searchSubject.next(query);
    } else {
      this.searchResults = [];
    }
  }
}
