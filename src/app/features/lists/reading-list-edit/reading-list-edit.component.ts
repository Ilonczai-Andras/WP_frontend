import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserDto } from '../../../models/userDto';
import { ProfileService } from '../../../core/services/profile.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ReadinglistService } from '../../../core/services/readinglist.service';
import { ReadingListItemResponseDto } from '../../../models/readingListItemResponseDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reading-list-edit',
  imports: [CommonModule],
  templateUrl: './reading-list-edit.component.html',
  styleUrl: './reading-list-edit.component.css',
})
export class ReadingListEditComponent {
  totalStories = 1;
  listId: number = 0;

  profile!: UserDto | null;

  readingListItems: ReadingListItemResponseDto[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private readinglistService: ReadinglistService
  ) {}

  ngOnInit(): void {
    this.listId = Number(this.route.snapshot.paramMap.get('listId'));

    this.getReadingListItems(this.listId);

    this.profileService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.profile = profile;
      });
  }

  getReadingListItems(listID: number) {
    this.readinglistService
      .getListItems(listID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.readingListItems = response;

        this.totalStories = response.map(() => {}).length;
      });
  }

  deleteReadingListItem(readingListItemId: number | undefined) {
    Swal.fire({
      title: 'Delete reading list item?',
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
        this.readinglistService
          .deleteReadingListItem(readingListItemId)
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Your reading list item has been deleted!',
                icon: 'success',
                confirmButtonText: 'Okay',
                customClass: {
                  confirmButton: 'custom-confirm-btn-success',
                  popup: 'custom-popup-success',
                },
                buttonsStyling: false,
              });
              this.getReadingListItems(this.listId);
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

  deleteAllReadingListItem() {
    Swal.fire({
      title: 'Delete all reading list item?',
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
        this.readinglistService
          .deleteAllReadingListItem(this.listId)
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Your reading list items has been deleted!',
                icon: 'success',
                confirmButtonText: 'Okay',
                customClass: {
                  confirmButton: 'custom-confirm-btn-success',
                  popup: 'custom-popup-success',
                },
                buttonsStyling: false,
              });
              this.getReadingListItems(this.listId);
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

  onClearAllStories() {
    if (
      confirm(
        'Are you sure you want to clear all stories from your reading list?'
      )
    ) {
      this.readingListItems = [];
      this.totalStories = 0;
    }
  }
}
