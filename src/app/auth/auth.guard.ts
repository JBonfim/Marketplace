import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private router: Router ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(localStorage.getItem('user') !== null && localStorage.getItem('user') !==  "undefined") {
        return true;
      } else {
        this.router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
  }
}
