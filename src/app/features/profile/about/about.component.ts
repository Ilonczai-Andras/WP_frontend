import { Component } from '@angular/core';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { ReadingListsComponent } from '../reading-lists/reading-lists.component';

@Component({
  selector: 'app-about',
  imports: [ProfileCardComponent, ReadingListsComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
