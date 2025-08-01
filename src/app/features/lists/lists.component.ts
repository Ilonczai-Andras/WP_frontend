import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReadingListResponseDto } from '../../models/readingListResponseDto';

@Component({
  selector: 'app-lists',
  imports: [CommonModule, RouterLink],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent {

  currentTab: string = 'reading-lists';

  readingLists: ReadingListResponseDto[] = [
    {
      name: 'Liked reading lists',
      storyCount: 0,
    },
    {
      name: 'test',
      storyCount: 0,
    },
    {
      name: "Bandi1602's Reading List",
      storyCount: 1,
    }
  ];

  constructor(private router: Router) {}

  navigateToTab(tab: string) {
    this.currentTab = tab;
    this.router.navigate(['/library', tab]);
  }

  createReadingList() {
    // Handle create reading list functionality
    console.log('Create reading list clicked');
  }

  toggleMenu() {
  }

}
