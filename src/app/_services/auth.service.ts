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
     // this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
      //this.user = this.userSubject.asObservable();
  }
  public get userValue(): any {
    //this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
     //this.user = this.userSubject.asObservable();
      this.decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
      return this.decodedToken;
  }

  login(model: any) {
    return this.http
     .post(`${environment.apiUrl}/api/login`, model).pipe(
       map((response: any) => {
         const user = response;
        // console.log(user.userToken)
         if(user.authenticated) {
           localStorage.setItem('token', user.accessToken);
           this.decodedToken = this.jwtHelper.decodeToken(user.accessToken);
         // console.log(this.decodedToken)
          return true;
         }else{
           return false;
         }
       })
     );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
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
