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
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  username: string | null = '';
  userId: number = 0;
  showDialog: boolean = false;

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
    this.userId = this.authService.getUserId();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const routeUsername = params.get('username');
      if (routeUsername) this.loadProfile(routeUsername);
    });

    this.dialogTriggerService.trigger$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.openProfileDialog();
      });

    this.profileService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.profile = profile;
      });

    this.profileService.isOwnProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOwn) => {
        this.isOwnProfile = isOwn;
      });
  }

  private loadProfile(routeUsername: string): void {
    const isOwn = routeUsername === this.username;

    if (isOwn) {
      this.profileService.loadOwnProfile(routeUsername);
    } else {
      this.profileService.loadProfileByUsername(routeUsername);
    }
    this.profileService
      .getUserByUsername(routeUsername)
      .subscribe((profile) => {
        if (profile?.id) {
          this.followerService
            .checkIfUserFollows(profile.id, this.userId)
            .subscribe((isFollowing) => {
              this.isFollowedByMe = isFollowing;
            });
          this.conversationService.prefetchUserPosts(profile.id);
          this.followerService.getFollowingById(profile.id).subscribe((res) => {
            this.followerService.setFollowData(res);
          });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openProfileDialog() {
    this.showDialog = true;
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

      this.profileService.uploadImage(formData, this.userId).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile image saved successfully',
          });
          this.profileService.refreshUserProfile(this.userId);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save profile image',
          });
        }
      );
    }
  }

  follow_unfollow(): void {
    if (!this.profile?.id) return;

    const userId = this.userId;
    const targetId = this.profile.id;

    const serviceCall = this.isFollowedByMe
      ? this.followerService.unfollowUser(userId, targetId)
      : this.followerService.followUser(userId, targetId);

    const successMessage = this.isFollowedByMe ? 'Unfollowed' : 'Followed';
    const errorMessage = this.isFollowedByMe ? 'unfollow' : 'follow';

    serviceCall.subscribe(
      () => {
        this.isFollowedByMe = !this.isFollowedByMe;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${successMessage} successfully`,
        });
        this.followerService.refreshFollowers(targetId);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${errorMessage} user`,
        });
      }
    );
  }
}
