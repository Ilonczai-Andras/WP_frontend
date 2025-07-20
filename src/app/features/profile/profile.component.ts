import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { UserDto } from '../../models/userDto';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { DialogTriggerService } from '../../core/services/dialog-trigger.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { FollowService } from '../../core/services/follow.service';
import { ConversationService } from '../../core/services/conversation.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, ProfileDialogComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  username: string | null = '';
  routeUsername: string | null = '';
  userid: number = 0;
  ShowDialog: boolean = false;

  profile!: UserDto | null;

  isOwnProfile = false;

  isFollowedByMe = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,
    private followerService: FollowService,
    private conversationService: ConversationService,
    private dialogTriggerService: DialogTriggerService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUserName();
    this.userid = this.authService.getUserId();

    this.route.paramMap.subscribe((params) => {
      const routeUsername = params.get('username');

      if (routeUsername) {
        const isOwn = routeUsername === this.username;
        this.profileService.setIsOwnProfile(isOwn);

        this.profileService
          .getUserByUsername(routeUsername)
          .subscribe((profile) => {
            this.profileService.setProfile(profile);
            if (profile.id) {
              this.getFollowers(profile?.id);
              this.getPostsForUser(profile.id);
            }
          });
      }
    });

    this.dialogTriggerService.trigger$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.openProfileDialog();
      });

    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
    });

    this.profileService.isOwnProfile$.subscribe((isOwn) => {
      this.isOwnProfile = isOwn;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openProfileDialog() {
    this.ShowDialog = true;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // ✅ Enforce max size (2MB = 2 * 1024 * 1024)
      const MAX_SIZE_MB = 2;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`Image is too large. Max size is ${MAX_SIZE_MB}MB.`);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      this.profileService.uploadImage(formData, this.userid).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile image saved successfully',
          });
          this.profileService.refreshUserProfile(this.userid);
        },
        (error) => {
          console.log(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save profile image',
          });
        }
      );
    }
  }

  getFollowers(userId: number): void {
    this.followerService.getFollowingById(userId).subscribe(
      (response) => {
        this.followerService.setFollowData(response);
      },
      () => {}
    );

    this.followerService.getFollowingById(this.userid).subscribe(
      (response) => {
        const following = response.following || [];

        this.isFollowedByMe = following.some((f) => f.id === this.profile?.id);
      },
      (error) => {}
    );
  }

  getPostsForUser(userId: number): void {
    this.conversationService.getPostsForUser(userId).subscribe(
      (response) => {
        this.conversationService.setConversationData(response);
      },
      (error) => {}
    );
  }

  follow_unfollow(): void {
    if (!this.profile?.id) return;
    if (this.isFollowedByMe) {
      this.followerService
        .unfollowUser(this.userid, this.profile?.id)
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Unfollowed successfully',
            });
            this.isFollowedByMe = false;
            if (this.profile?.id)
              this.followerService.refreshFollowers(this.profile?.id);
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to unfollow user',
            });
          }
        );
    } else {
      this.followerService.followUser(this.userid, this.profile?.id).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Followed successfully',
          });
          this.isFollowedByMe = true;
          if (this.profile?.id)
            this.followerService.refreshFollowers(this.profile?.id);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to follow user',
          });
        }
      );
    }
  }
}
