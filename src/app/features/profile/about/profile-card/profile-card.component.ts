import { Component } from '@angular/core';
import { UserDto } from '../../../../models/userDto';
import { ProfileService } from '../../../../core/services/profile.service';
import { ProfileDialogComponent } from '../../profile-dialog/profile-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-card',
  imports: [ProfileDialogComponent, CommonModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css',
})
export class ProfileCardComponent {
  profile!: UserDto | null;
  joinedText: string | null = '';
  ShowDialog: boolean = false;
  description: string | undefined = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
      this.description = profile?.userprofile?.description;

      const joinedAt = profile?.userprofile?.joinedAt;
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
  }

  openProfileDialog() {
    this.ShowDialog = true;
  }
}
