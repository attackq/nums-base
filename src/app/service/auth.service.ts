import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.interface';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  filter,
  from,
  map,
  of,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Subject<User | null> = new ReplaySubject<User | null>(1);

  baseUserUrl: string = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {
    this.getAllUsers()
      .pipe(
        map((users: User[]) => {
          const userToken = localStorage.getItem('tokenId');
          return users.filter((user) => user.tokenId.toString() === userToken);
        }),
        tap((users: User[]) => {
          this.user$.next(users[0]);
        })
      )
      .subscribe();
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUserUrl);
  }

  getUserByUsername(username: string): Observable<User[]> {
    return this.http.get<User[]>(this.baseUserUrl + `/?username=${username}`);
  }

  registerUser(user: User) {
    return this.http.post(this.baseUserUrl, user);
  }

  deleteUser(id: string) {
    return this.http.delete(this.baseUserUrl + '/' + id);
  }
}
