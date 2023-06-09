import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.interface';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: ReplaySubject<User | null> = new ReplaySubject<User | null>(1);

  baseUserUrl: string = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUserUrl);
  }

  getUserByUsername(username: string): Observable<User[]> {
    return this.http.get<User[]>(this.baseUserUrl + `/?username=${username}`);
  }

  registerUser(user: User) {
    return this.http.post<User>(this.baseUserUrl, user);
  }
}
