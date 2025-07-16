import { Component } from '@angular/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { UserDto } from '../../../../models/userDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reading-lists',
  imports: [CommonModule],
  templateUrl: './reading-lists.component.html',
  styleUrl: './reading-lists.component.css',
})
export class ReadingListsComponent {
  profile!: UserDto | null;
  isOwnProfile = false;

  constructor(
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
    });

    this.profileService.isOwnProfile$.subscribe((isOwn) => {
      this.isOwnProfile = isOwn;
    });
  }
}
