import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EditedUser, User } from './user.interface';
import { Observable, ReplaySubject, Subject, map, tap } from 'rxjs';
import { Card, CardNumber, NewNumber } from './number.interface';

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

  // users

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUserUrl);
  }

  getUserByUsername(username: string): Observable<User[]> {
    return this.http.get<User[]>(this.baseUserUrl + `/?username=${username}`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(this.baseUserUrl + '/' + id);
  }

  registerUser(user: User) {
    return this.http.post(this.baseUserUrl, user);
  }

  editUser(id: string, body: EditedUser) {
    return this.http.patch(this.baseUserUrl + '/' + id, body);
  }

  deleteUser(id: string) {
    return this.http.delete(this.baseUserUrl + '/' + id);
  }

  // cards

  getAllNumbers(): Observable<Card[]> {
    return this.http.get<Card[]>(this.baseNumbersUrl);
  }

  getCardById(id: string): Observable<Card> {
    return this.http.get<Card>(this.baseNumbersUrl + '/' + id);
  }

  addCard(card: Card) {
    return this.http.post(this.baseNumbersUrl, card);
  }

  addNumberToCard(id: string, number: NewNumber) {
    return this.http.patch(this.baseNumbersUrl + '/' + id, number);
  }

  deleteNumber(id: string, number: NewNumber) {
    return this.http.patch(this.baseNumbersUrl + '/' + id, number);
  }
}
