import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EditedUser, User } from './user.interface';
import { Observable, ReplaySubject, Subject, map, tap } from 'rxjs';
import { Number } from './number.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Subject<User | null> = new ReplaySubject<User | null>(1);
  public isActiiveBtn$: Subject<boolean> = new ReplaySubject<boolean>(1);

  baseUserUrl: string = 'http://localhost:3000/users';
  baseNumbersUrl: string = 'http://localhost:3000/numbers';

  constructor(private http: HttpClient) {
    this.getAllUsers()
      .pipe(
        map((users: User[]) => {
          const userToken = localStorage.getItem('tokenId');
          return users.filter((user) => user.tokenId.toString() === userToken);
        }),
        tap((users: User[]) => {
          this.user$.next(users[0]);
          this.isActiiveBtn$.next(true);
        })
      )
      .subscribe();
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUserUrl);
  }

  getAllNumbers(): Observable<Number[]> {
    return this.http.get<Number[]>(this.baseNumbersUrl);
  }

  getUserByUsername(username: string): Observable<User[]> {
    return this.http.get<User[]>(this.baseUserUrl + `/?username=${username}`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(this.baseUserUrl + '/' + id);
  }

  getNumberById(id: string): Observable<Number> {
    return this.http.get<Number>(this.baseNumbersUrl + '/' + id);
  }

  registerUser(user: User) {
    return this.http.post(this.baseUserUrl, user);
  }

  addNumber(id: string, number: Number) {
    return this.http.patch(this.baseNumbersUrl + 'id', number);
  }

  addCard(card: Number) {
    return this.http.post(this.baseNumbersUrl, card);
  }

  editUser(id: string, body: EditedUser) {
    return this.http.patch(this.baseUserUrl + '/' + id, body);
  }

  deleteUser(id: string) {
    return this.http.delete(this.baseUserUrl + '/' + id);
  }
}
