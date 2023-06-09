import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUserUrl: string = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get(this.baseUserUrl);
  }

  getUserByUsername(username: string) {
    return this.http.get(this.baseUserUrl + `/?username=${username}`);
  }

  registerUser(user: any) {
    return this.http.post(this.baseUserUrl, user);
  }
}
