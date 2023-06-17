import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './service/user.interface';
import { EditedCardData } from './service/number.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'nums-base';
  isLogged: boolean;
  loggedUser: User | null;
  dataas: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user: User | null) => {
      this.loggedUser = user;
    });
    // this.authService.getUserById('1').subscribe((res) => {
    //   console.log(res);
    // });
    // this.authService.postToCard('301569', newdata).subscribe();
  }

  logout() {
    this.authService.user$.next(null);
    localStorage.clear();
    this.router.navigate(['']);
  }
}
