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
import { Subject, take, takeUntil } from 'rxjs';
import { ReadinglistService } from '../../core/services/readinglist.service';
import { ReadingListModalComponent } from './reading-list-modal/reading-list-modal.component';
import { ProfileService } from '../../core/services/profile.service';
import { UserDto } from '../../models/userDto';
import { ReadingListRequestDto } from '../../models/readingListRequestDto';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lists',
  imports: [CommonModule, ReadingListModalComponent, DragDropModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent implements OnInit, OnDestroy {
  currentTab: string = 'reading-lists';

  profile: UserDto | null = {};

  readingLists: ReadingListResponseDto[] = [];

  openedMenuIndex: number | null = null;

  showModal = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private readingListService: ReadinglistService,
    private profileService: ProfileService,
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
        if (response) {
          this.readingLists = response;
        }
      });

    this.profileService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.profile = response;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToTab(tab: string) {
    this.currentTab = tab;
  }

  createReadingList(name: string) {
    const req: ReadingListRequestDto = {
      name: name,
      private: false,
    };
    this.readingListService
      .createList(this.profile?.id, req)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.readingListService.refreshReadingLists(this.profile?.id);
      });
  }

  toggleMenu(index: number) {
    this.openedMenuIndex = this.openedMenuIndex === index ? null : index;
  }

  closeMenu() {
    this.openedMenuIndex = null;
  }

  openModal() {
    this.showModal = true;
  }

  drop(event: CdkDragDrop<ReadingListResponseDto[]>) {
    moveItemInArray(this.readingLists, event.previousIndex, event.currentIndex);
  }

  deleteById(readingListId: number | undefined) {
    if (!readingListId || !this.profile?.id) return;

    Swal.fire({
      title: 'Delete reading list?',
      html: `This action can't be undone`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'custom-confirm-btn',
        cancelButton: 'custom-cancel-btn',
        popup: 'custom-popup',
        title: 'custom-title',
        htmlContainer: 'custom-text',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.readingListService.deleteReadingList(readingListId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Your reading list has been deleted!',
              icon: 'success',
              confirmButtonText: 'Okay',
              customClass: {
                confirmButton: 'custom-confirm-btn-success',
                popup: 'custom-popup-success',
              },
              buttonsStyling: false,
            });
            this.readingListService.refreshReadingLists(this.profile!.id);
          },
          error: (err) => {
            console.error('Failed to delete reading list:', err);
            Swal.fire({
              title: 'Error deleting reading list',
              text: 'Something went wrong. Please try again.',
              icon: 'error',
              confirmButtonText: 'Okay',
              customClass: {
                confirmButton: 'custom-confirm-btn-error',
                popup: 'custom-popup-error',
              },
              buttonsStyling: false,
            });
          },
        });
      }
    });
  }

  editList(list: ReadingListResponseDto) {
    // open modal pre-filled or navigate to edit route
    console.log('Edit:', list);
  }
}
