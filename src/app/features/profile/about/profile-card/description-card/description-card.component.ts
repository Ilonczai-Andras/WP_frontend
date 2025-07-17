import { Component } from '@angular/core';
import { UserDto } from '../../../../../models/userDto';
import { ProfileService } from '../../../../../core/services/profile.service';
import { DialogTriggerService } from '../../../../../core/services/dialog-trigger.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-description-card',
  imports: [CommonModule],
  templateUrl: './description-card.component.html',
  styleUrl: './description-card.component.css',
})
export class DescriptionCardComponent {
  profile!: UserDto | null;
  joinedText: string | null = '';
  description: string | undefined = '';

  isOwnProfile = false;

  constructor(
    private profileService: ProfileService,
    private dialogTriggerService: DialogTriggerService
  ) {}

  ngOnInit(): void {
    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
      this.description = profile?.userProfileDto?.description;

      const joinedAt = profile?.userProfileDto?.joinedAt;
      if (joinedAt && joinedAt.length >= 7) {
        const date = new Date(
          Number(joinedAt[0]),
          Number(joinedAt[1]) - 1,
          Number(joinedAt[2]),
          Number(joinedAt[3]),
          Number(joinedAt[4]),
          Number(joinedAt[5]),
          Math.floor(Number(joinedAt[6]) / 1e6)
        );

        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };

        this.joinedText = ' ' + date.toLocaleDateString('en-US', options);
      }
    });

    this.profileService.isOwnProfile$.subscribe((isOwn) => {
      this.isOwnProfile = isOwn;
    });
  }

  openProfileDialog() {
    this.dialogTriggerService.triggerOpen();
  }
}
