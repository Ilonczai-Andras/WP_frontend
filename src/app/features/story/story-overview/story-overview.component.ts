import { Component, ElementRef, HostListener } from '@angular/core';
import { StoryResponseDto } from '../../../models/storyResponseDto';
import { ProfileService } from '../../../core/services/profile.service';
import { StoryService } from '../../../core/services/story.service';
import { UserDto } from '../../../models/userDto';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReadinglistService } from '../../../core/services/readinglist.service';
import { ReadingListRequestDto } from '../../../models/readingListRequestDto';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ReadingListResponseDto } from '../../../models/readingListResponseDto';
import { ReadingListItemResponseDto } from '../../../models/readingListItemResponseDto';
import { AddStoryToListRequestDto } from '../../../models/addStoryToListRequestDto';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-story-overview',
  imports: [CommonModule, FormsModule],
  templateUrl: './story-overview.component.html',
  styleUrl: './story-overview.component.css',
})
export class StoryOverviewComponent {
  profile!: UserDto | null;
  loginedProfileId: number = 0;
  isOwnProfile = false;

  disableAddToReadingList: boolean = false;

  newListName = '';

  showDropdown = false;

  selectedLists = new Set<ReadingListResponseDto>();
  listItems: Array<ReadingListItemResponseDto> = [];

  readingLists: ReadingListResponseDto[] = [];

  story: StoryResponseDto = {};

  private destroy$ = new Subject<void>();

  constructor(
    private profileService: ProfileService,
    private storyService: StoryService,
    private readingListService: ReadinglistService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (
      !this.elementRef.nativeElement.contains(target) ||
      (!target.closest('.more-btn-and-dropdown') &&
        !target.closest('.more-btn'))
    ) {
      if (!target.closest('.more-btn')) {
        this.closeDropdown();
      }
    }
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('storyIdAndTitle');
    const id = param ? Number(param.split('-')[0]) : 0;
    this.loginedProfileId = this.authService.getUserId();

    this.storyService.getStory(id).subscribe((story) => {
      this.story = story;

      this.disableAddToReadingList =
        this.story.authorId === this.loginedProfileId;

      this.readingListService.getUserLists(this.loginedProfileId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          this.readingLists = response || [];

          this.readingLists.forEach((list) => {
            const containsStory = list.items?.some(
              (item) => Number(item.storyId) === this.story.id
            );
            if (containsStory) {
              this.selectedLists.add(list);
            }
          });
        });
    });

    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
    });

    this.profileService.isOwnProfile$.subscribe((isOwn) => {
      this.isOwnProfile = isOwn;
    });
  }

  startReading(): void {
    this.readingListService.addStory;
  }

  showMore(): void {}

  saveReadingLists() {
    const req: AddStoryToListRequestDto = {
      storyId: this.story.id,
      listIds: Array.from(this.selectedLists)
        .map((list) => list.id)
        .filter((id): id is number => id !== undefined),
    };

    this.readingListService
      .addStory(req)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('Story successfully saved to selected reading lists!');
        this.closeDropdown();
      });
  }

  toggleListSelection(list: ReadingListResponseDto) {
    if (this.selectedLists.has(list)) {
      this.selectedLists.delete(list);
    } else {
      this.selectedLists.add(list);
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  createReadingList() {
    const req: ReadingListRequestDto = {
      name: this.newListName,
      private: false,
    };
    this.readingListService
      .createList(this.profile?.id, req)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.readingListService.refreshReadingLists(this.profile?.id);
        this.newListName = '';
      });
  }
}
