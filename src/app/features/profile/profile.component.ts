import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  username!: string;
  works: number = 0;
  readingList: number = 0;
  followers: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username')!;
  }
}
