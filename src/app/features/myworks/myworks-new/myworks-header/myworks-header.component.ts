import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { StoryService } from '../../../../core/services/story.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { UserDto } from '../../../../models/userDto';
import { Subject, takeUntil } from 'rxjs';
import { StoryRequestDto } from '../../../../models/storyRequestDto';

@Component({
  selector: 'app-myworks-header',
  imports: [],
  templateUrl: './myworks-header.component.html',
  styleUrl: './myworks-header.component.css',
})
export class MyWorksHeaderComponent implements OnInit, OnDestroy {
  profile!: UserDto | null;

  private destroy$ = new Subject<void>();

  storyRequest!: StoryRequestDto;

  file!: any;

  constructor(
    private location: Location,
    private storyService: StoryService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.profile = profile;
      });

    this.storyService.story$.subscribe((story) => {
      this.storyRequest = story || {};
    });

    this.storyService.file$
      .pipe(takeUntil(this.destroy$))
      .subscribe((file) => {
        this.file = file;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.location.back();
  }

  get isComplete(): boolean {
    return this.storyService.isCompleteStory(this.storyRequest);
  }

  onSubmit() {
    console.log(this.profile?.id);

    if (this.profile?.id)
      if (this.isComplete) {
        this.storyService
          .createStory(this.profile.id, this.storyRequest, this.file)
          .subscribe({
            next: () => console.log('Story submitted'),
            error: (err) => console.error(err),
          });
      }
    // else {
    //   this.storyService
    //     .createStoryWithDefaultValues(this.profile.id)
    //     .subscribe({
    //       next: () => console.log('Default story submitted'),
    //       error: (err) => console.error(err),
    //     });
    // }
  }
}
