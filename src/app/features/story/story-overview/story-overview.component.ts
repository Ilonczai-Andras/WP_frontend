import { Component } from '@angular/core';
import { StoryResponseDto } from '../../../models/storyResponseDto';
import { ProfileService } from '../../../core/services/profile.service';
import { StoryService } from '../../../core/services/story.service';
import { UserDto } from '../../../models/userDto';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-story-overview',
  imports: [CommonModule],
  templateUrl: './story-overview.component.html',
  styleUrl: './story-overview.component.css',
})
export class StoryOverviewComponent {
  profile!: UserDto | null;
  isOwnProfile = false;

  story: StoryResponseDto | null = {};

  constructor(
    private profileService: ProfileService,
    private storyService: StoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('storyIdAndTitle');
    const id = param ? Number(param.split('-')[0]) : 0;

    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
    });

    this.profileService.isOwnProfile$.subscribe((isOwn) => {
      this.isOwnProfile = isOwn;
    });

    this.storyService.getStory(id).subscribe((story) => {
      this.story = story;
    });
  }

  startReading(): void {}

  showMore(): void {}
}
