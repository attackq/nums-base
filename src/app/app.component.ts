import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './service/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'nums-base';
  isLogged: boolean;
  loggedUser: User | null;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.user$.subscribe((user: User | null) => {
      this.loggedUser = user;
    });
  }

  logout() {
    this.authService.user$.next(null);
    localStorage.clear();
    this.router.navigate(['']);
  }
}
