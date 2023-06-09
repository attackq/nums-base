import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-userslist',
  templateUrl: './userslist.component.html',
  styleUrls: ['./userslist.component.css'],
})
export class UserslistComponent implements OnInit {
  isLogged: boolean;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    let x = sessionStorage.getItem('username');
    console.log(x);
  }
}
