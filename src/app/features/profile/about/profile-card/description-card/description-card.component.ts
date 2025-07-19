import { Component } from '@angular/core';
import { UserDto } from '../../../../../models/userDto';
import { ProfileService } from '../../../../../core/services/profile.service';
import { DialogTriggerService } from '../../../../../core/services/dialog-trigger.service';
import { CommonModule } from '@angular/common';
import { getFormattedDateFromNumberArray } from '../../../../../shared/utils/string-utils';

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
      this.joinedText = getFormattedDateFromNumberArray(joinedAt);
    });

    this.profileService.isOwnProfile$.subscribe((isOwn) => {
      this.isOwnProfile = isOwn;
    });
  }

  openProfileDialog() {
    this.dialogTriggerService.triggerOpen();
  }
}
