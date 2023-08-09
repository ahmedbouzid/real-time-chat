import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';



@Injectable({
  providedIn:'root'
})
export class AuthGuard implements CanActivate {

constructor (private router :  Router , private jwtService : JwtHelperService ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      
      if (this.jwtService.isTokenExpired()) {
        this.router.navigate([''])
        return false
      } else {
        return true
      }

  }



}
