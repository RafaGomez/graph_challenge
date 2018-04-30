import { User } from './../models/User';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {


  private userLogged: User = null;
  /** Fires an event everytime a user logs in or logs out */
  private userLogged$: Subject<User>;

  constructor() {
    this.userLogged$ = new Subject<User>();
  }


  public logIn(user: string, password: string): Observable<boolean> {
    let correct = false;
    if (user === 'test' && password === 'test') {
      correct = true;
      this.userLogged = { userName: 'test', password: ''};
      this.userLogged$.next(this.userLogged);
    }
    return Observable.of(correct);
  }

  public logOut() {
    this.userLogged = null;
    this.userLogged$.next(null);
  }

  public getUserLogged() {
    return this.userLogged;
  }
}
