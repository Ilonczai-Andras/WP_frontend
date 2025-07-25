import { Component } from '@angular/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { UserDto } from '../../../../models/userDto';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../../../core/services/story.service';
import { StoryResponseDto } from '../../../../models/storyResponseDto';
import { RouterModule } from '@angular/router';
import { ReplaceSpacesPipe } from "../../../../shared/pipes/replace-spaces.pipe";

@Component({
  selector: 'app-reading-lists',
  imports: [CommonModule, RouterModule, ReplaceSpacesPipe],
  templateUrl: './reading-lists.component.html',
  styleUrl: './reading-lists.component.css',
})
export class ReadingListsComponent {
  profile!: UserDto | null;
  isOwnProfile = false;

  visibleCount = 3;

  stories: Array<StoryResponseDto> | null = [];
  publishedStoryCount: number | undefined = 0;
  draftStoryCount: number | undefined = 0;

  constructor(
    private profileService: ProfileService,
    private storyService: StoryService
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
  }

  showMore(): void {
    this.visibleCount += 3;
  }
}
