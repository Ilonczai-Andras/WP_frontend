import { Component } from '@angular/core';
import { ReadingListItemComponent } from './reading-list-item/reading-list-item.component';

@Component({
  selector: 'app-reading-lists',
  imports: [ReadingListItemComponent],
  templateUrl: './reading-lists.component.html',
  styleUrl: './reading-lists.component.css'
})
export class ReadingListsComponent {

}
