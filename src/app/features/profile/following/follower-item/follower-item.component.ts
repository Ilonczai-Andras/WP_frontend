import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-follower-item',
  imports: [CommonModule],
  templateUrl: './follower-item.component.html',
  styleUrl: './follower-item.component.css',
})
export class FollowerItemComponent {
  @Input() follower: any;

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
