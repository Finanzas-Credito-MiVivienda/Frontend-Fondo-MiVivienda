import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { Users } from '../services/users';

@Injectable({
  providedIn:'root'
})
export class AutorizarClienteGuard {
  constructor (private userService: Users) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
   MaybeAsync<GuardResult>
  {
    let permisos = this.userService.getRolActual();
    if (permisos) {
      if (permisos.indexOf("CLIENT")>=0) {
        return true;
      }
    }
    return false;
  }
}

/*export const autorizarClientGuard: CanActivateFn = (route, state) => {
  return true;
};*/