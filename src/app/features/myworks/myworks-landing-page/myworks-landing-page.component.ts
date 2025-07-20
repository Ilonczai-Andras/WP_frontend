import { Component, OnInit } from '@angular/core';
import { UserDto } from '../../../models/userDto';
import { ProfileService } from '../../../core/services/profile.service';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-myworks-landing-page',
  imports: [RouterModule],
  templateUrl: './myworks-landing-page.component.html',
  styleUrl: './myworks-landing-page.component.css'
})
export class MyworksLandingPageComponent implements OnInit {
  profile!: UserDto | null;

  private destroy$ = new Subject<void>();

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.profile = profile;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
