import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';
import { User } from '../service/user.interface';

@Component({
  selector: 'app-userslist',
  templateUrl: './userslist.component.html',
  styleUrls: ['./userslist.component.css'],
})
export class UserslistComponent implements OnInit {
  constructor(private authService: AuthService) {}
  user: User | null;
  ngOnInit(): void {
    this.authService.user$.subscribe((val: User | null) => {
      this.user = val;
    });
  }
}
