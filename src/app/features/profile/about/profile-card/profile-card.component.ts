import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowerCardComponent } from './follower-card/follower-card.component';
import { DescriptionCardComponent } from './description-card/description-card.component';

@Component({
  selector: 'app-profile-card',
  imports: [CommonModule, FollowerCardComponent, DescriptionCardComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css',
})
export class ProfileCardComponent {

}
