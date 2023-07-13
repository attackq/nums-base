import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Feed } from '../service/feed.interface';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  feed: Feed[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getFeed().subscribe((res: Feed[]) => {
      this.feed = res;
    });
  }
}
