import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

interface MenuItem {
  name: string;
  route?: string;
  notifications?: number;
  separator?: boolean;
}

@Component({
  selector: 'app-dropdown-menu',
  imports: [DropdownModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dropdown-menu.html',
  styleUrl: './dropdown-menu.css',
})
export class DropdownMenu implements OnInit, OnChanges {
  @Input() showMenu: boolean = false;

  menuItems: MenuItem[] | undefined;
  form: FormGroup;

  userName: string | null = null;
  subscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      selectedMenuItem: [null],
    });
  }

  ngOnInit() {
    this.subscription = this.authService.currentUser$.subscribe((user) => {
      this.userName = user?.userName ?? null;
      this.buildMenuItems();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  ngOnChanges() {
    if (!this.showMenu) {
      this.resetDropdown();
    }
  }

  private buildMenuItems() {
    this.menuItems = [
      { name: 'My Profile', route: '/user/' + (this.userName ?? '') },
      { name: 'Inbox', route: '/inbox' },
      { name: 'Notifications', route: '/notifications' },
      { name: 'Library', route: '/library' },
      { name: 'Language: English', route: '/settings/language' },
      { name: 'Help', route: '/help' },
      { name: 'Settings', route: '/settings' },
      { name: 'Log Out', route: '/logout' },
    ];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
    this.resetDropdown();
  }

  onMenuItemClick(item: MenuItem) {
    if (item.name === 'Log Out') {
      this.logout();
    } else if (item.route) {
      this.router.navigateByUrl(item.route);
      this.resetDropdown();
    }
  }

  resetDropdown() {
    this.form.get('selectedMenuItem')?.setValue(null);
  }
}
