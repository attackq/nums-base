import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Feed } from '../service/feed.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  feed: Feed[];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService
      .getFeed()
      .pipe(
        tap((res: Feed[]) => {
          this.feed = res;
          console.log(res[res.length]);
          const feedItem: Feed = {
            id: this.feed[this.feed.length - 1].id,
            lastname: 'dafadsf',
            number: 'a321423',
            data: Date.now(),
            action: 'добавил',
          };
          this.feed.push(feedItem);
        }),
        switchMap((res) => {
          return this.authService.updateFeed(this.feed);
        })
      )
      .subscribe();
  }
}
