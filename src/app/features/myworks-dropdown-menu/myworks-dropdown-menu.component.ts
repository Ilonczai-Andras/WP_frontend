import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-myworks-dropdown-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './myworks-dropdown-menu.component.html',
  styleUrls: ['./myworks-dropdown-menu.component.css'],
})
export class MyworksDropdownMenuComponent {
  isDropdownOpen: boolean = false;
  menuItems = [
    {
      label: 'Create a new story',
      icon: 'M13 14H11V17H9V14H6V12H9V9H11V12H14V14H13ZM20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z',
      action: 'createStory',
      route: 'myworks/new',
    },
    {
      label: 'My Stories',
      action: 'myStories',
      route: 'myworks',
    },
    {
      label: 'Helpful writer resources',
      action: 'myworks/writerResources',
      separator: true,
    },
    {
      label: 'Wattpad programs & opportunities',
      action: 'wattpadPrograms',
      route: 'myworks/programs',
    },
    {
      label: 'Writing contests',
      action: 'writingContests',
      route: 'myworks/contests',
    },
  ];

  constructor() {}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onItemClick(item: any): void {
    console.log(`Clicked: ${item.label} (Action: ${item.action})`);
    switch (item.action) {
      case 'createStory':
        // Logic to navigate to create story page or open a modal
        break;
      case 'myStories':
        // Logic to navigate to my stories page
        break;
      // ... other cases
    }
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (
      this.isDropdownOpen &&
      !target.closest('.dropdown-container') &&
      !target.closest('.dropdown-button')
    ) {
      this.isDropdownOpen = false;
    }
  }
}
