import { Component } from '@angular/core';
import { ReadingListItemComponent } from './reading-list-item/reading-list-item.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { UserDto } from '../../../../models/userDto';

@Component({
  selector: 'app-reading-lists',
  imports: [ReadingListItemComponent],
  templateUrl: './reading-lists.component.html',
  styleUrl: './reading-lists.component.css',
})
export class ReadingListsComponent {
  username: string | null = '';
  profile!: UserDto | null;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUserName();
    this.profile = this.profileService.getProfile();
  }
}
