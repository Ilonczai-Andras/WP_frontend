import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';

interface MenuItem {
  name: string;
  route?: string;
  notifications?: number;
  separator?: boolean;
}

@Component({
  selector: 'app-profile',
  imports: [DropdownModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  menuItems: MenuItem[] | undefined;
  constructor() {}

  ngOnInit() {
    this.menuItems = [
      { name: 'My Profile', route: '/profile' },
      { name: 'Inbox', route: '/inbox' },
      { name: 'Notifications', route: '/notifications'},
      { name: 'Library', route: '/library' },
      { name: 'Language: English', route: '/settings/language' },
      { name: 'Help', route: '/help' },
      { name: 'Settings', route: '/settings' },
      { name: 'Log Out', route: '/logout' },
    ];
  }
}
