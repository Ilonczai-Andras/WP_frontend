import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReadingListResponseDto } from '../../models/readingListResponseDto';
import { Subject, takeUntil } from 'rxjs';
import { ReadinglistService } from '../../core/services/readinglist.service';

@Component({
  selector: 'app-lists',
  imports: [CommonModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent implements OnInit, OnDestroy {
  currentTab: string = 'reading-lists';

  readingLists: ReadingListResponseDto[] | null = [];

  openedMenuIndex: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private readingListService: ReadinglistService,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (
      !this.elementRef.nativeElement.contains(target) ||
      (!target.closest('.dropdown-menu') && !target.closest('.menu-btn'))
    ) {
      if (!target.closest('.menu-btn')) {
        this.closeMenu();
      }
    }
  }

  ngOnInit(): void {
    this.readingListService.readingList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.readingLists = response;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToTab(tab: string) {
    this.currentTab = tab;
  }

  createReadingList() {
    // Handle create reading list functionality
    console.log('Create reading list clicked');
  }

  toggleMenu(index: number) {
    this.openedMenuIndex = this.openedMenuIndex === index ? null : index;
  }

  closeMenu() {
    this.openedMenuIndex = null;
  }
}
