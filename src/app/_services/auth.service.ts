import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { User } from '../_models/User';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

  baseURL = 'http://localhost:5000/api/users/';
  baseURLLogin = 'http://localhost:5000/api/login'
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
      this.user = this.userSubject.asObservable();
  }
  public get userValue(): User {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
      this.user = this.userSubject.asObservable();
      return this.userSubject.value;
  }

  login(username: string, password: string) {
    const httpOptions = {

    };

    const url = `${environment.apiUrl}/api/login`;
    const body = JSON.stringify({username: username,
                                 password: password});
    const headers =  new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': 'Basic ' + btoa(`${username}:${password}`),
      'Access-Control-Allow-Origin': '*'
    })


    return this.http.post<any>(url, body, {headers: headers})
        .pipe(map(user => {
            // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
            user.authdata = window.btoa(username + ':' + password);
            user.userName = username;
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            return user;
        }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/user/login']);
  }

  register(model: any) {
    return this.http.post(`${this.baseURL}`, model);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

}
