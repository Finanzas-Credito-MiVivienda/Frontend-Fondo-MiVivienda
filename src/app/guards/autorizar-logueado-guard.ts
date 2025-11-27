import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { Users } from '../services/users';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn:'root'
})
export class AutorizarLogeadoGuard {
  constructor (private userService: Users, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
   MaybeAsync<GuardResult>
  {
    const isLoggedIn = this.userService.hayUsuarioLogueado();
    if (isLoggedIn) {
      return true;
    } else {
      this.router.navigate(["/login"]);
      return false;
    }   
  } 
}

/*export const autorizarLogueadoGuard: CanActivateFn = (route, state) => {
  return true;
};*/