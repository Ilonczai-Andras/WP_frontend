import { Component } from '@angular/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { UserDto } from '../../../../models/userDto';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../../../core/services/story.service';
import { StoryResponseDto } from '../../../../models/storyResponseDto';
import { RouterModule } from '@angular/router';
import { ReplaceSpacesPipe } from '../../../../shared/pipes/replace-spaces.pipe';
import { DialogTriggerService } from '../../../../core/services/dialog-trigger.service';
import { ReadingListModalComponent } from '../../../lists/reading-list-modal/reading-list-modal.component';
import { ReadingListRequestDto } from '../../../../models/readingListRequestDto';
import { ReadinglistService } from '../../../../core/services/readinglist.service';
import { Subject, takeUntil } from 'rxjs';
import { ReadingListResponseDto } from '../../../../models/readingListResponseDto';
import { ReadingListItemComponent } from './reading-list-item/reading-list-item.component';

@Component({
  selector: 'app-reading-lists',
  imports: [
    CommonModule,
    RouterModule,
    ReplaceSpacesPipe,
    ReadingListModalComponent,
    ReadingListItemComponent
  ],
  templateUrl: './reading-lists.component.html',
  styleUrl: './reading-lists.component.css',
})
export class ReadingListsComponent {
  profile!: UserDto | null;
  isOwnProfile = false;

  showModal = false;

  defaultReadingLists: ReadingListResponseDto[] | undefined = [];
  readingListLength: number | undefined = 0;

  visibleCount = 3;

  stories: Array<StoryResponseDto> | null = [];
  publishedStoryCount: number | undefined = 0;
  draftStoryCount: number | undefined = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private profileService: ProfileService,
    private storyService: StoryService,
    private readingListService: ReadinglistService
  ) {}

  ngOnInit(): void {
    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
    });

    this.profileService.isOwnProfile$.subscribe((isOwn) => {
      this.isOwnProfile = isOwn;
    });

    this.storyService.stories$.subscribe((response) => {
      this.stories = response;
      this.publishedStoryCount = response?.filter(
        (story) => story.status === 'PUBLISHED'
      ).length;

      this.draftStoryCount = response?.filter(
        (story) => story.status === 'DRAFT'
      ).length;
    });

    this.readingListService.readingList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.readingListLength = response?.filter((story) => story).length;

        this.defaultReadingLists =
          response?.filter(
            (readingList) =>
              readingList.readingListType ===
              ReadingListResponseDto.ReadingListTypeEnum.Default
          ) || [];
      });

  }

  showMore(): void {
    this.visibleCount += 3;
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

  openModal() {
    this.showModal = true;
  }
}
