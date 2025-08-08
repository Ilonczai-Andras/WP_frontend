import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserDto } from '../../../models/userDto';
import { ProfileService } from '../../../core/services/profile.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ReadinglistService } from '../../../core/services/readinglist.service';
import { ReadingListItemResponseDto } from '../../../models/readingListItemResponseDto';

@Component({
  selector: 'app-reading-list-edit',
  imports: [CommonModule],
  templateUrl: './reading-list-edit.component.html',
  styleUrl: './reading-list-edit.component.css',
})
export class ReadingListEditComponent {
  totalStories = 1;

  profile!: UserDto | null;

  readingListItems: ReadingListItemResponseDto[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private readinglistService: ReadinglistService
  ) {}

  ngOnInit(): void {
    const listID = Number(this.route.snapshot.paramMap.get('listId'));
    console.log(listID);

    this.readinglistService
      .getListItems(listID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.readingListItems = response;
      });

    this.profileService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.profile = profile;
      });
  }

  onRemoveBook() {}

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
