import { Component, OnInit } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { CommonModule, Location } from '@angular/common';
import { UserDto } from '../../../models/userDto';
import { ProfileService } from '../../../core/services/profile.service';
import { StoryResponseDto } from '../../../models/storyResponseDto';
import { StoryService } from '../../../core/services/story.service';
import { ActivatedRoute } from '@angular/router';
import { getFormattedDateFromNumberArray } from '../../../shared/utils/string-utils';
import { ChapterService } from '../../../core/services/chapter.service';

@Component({
  selector: 'app-myworks-edit-story',
  imports: [LoadingSpinnerComponent, CommonModule],
  templateUrl: './myworks-edit-story.component.html',
  styleUrl: './myworks-edit-story.component.css',
})
export class MyworksEditStoryComponent implements OnInit {
  activeTab: string = 'tableOfContents';

  isLoading: boolean = false;

  profile!: UserDto | null;

  story: StoryResponseDto | null = {};

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private storyService: StoryService,
    private chapterService: ChapterService
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('storyIdAndTitle');
    const id = param ? Number(param.split('-')[0]) : 0;

    this.profileService.profile$.subscribe((response) => {
      this.profile = response;
    });

    this.loadStory(id);
  }

  private loadStory(storyId: number | undefined) {
    this.storyService.getStory(storyId ?? 0).subscribe((response) => {
      this.story = response;
    });
  }

  goBack(): void {
    this.location.back();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  createNewPart() {
    if (this.story?.chapters && this.story.chapters.length > 0) {
      const maxChapterId = Math.max(
        ...this.story?.chapters
          .map((chapter) => chapter.id)
          .filter((id) => id !== undefined)
      );
      this.chapterService
        .createNextChapter(maxChapterId)
        .subscribe((response) => {
          this.storyService.refreshStories(this.profile?.id);
        });
    }
  }

  viewAsReader() {
    console.log('Opening reader view...');
  }

  getFormattedDate(input: any): string {
    return getFormattedDateFromNumberArray(input);
  }

  onSave() {}
}
