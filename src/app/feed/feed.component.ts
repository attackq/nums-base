import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Feed } from '../service/feed.interface';
import { Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  feed: Feed[];
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.feed$.subscribe((res) => (this.feed = res));
  }
}
