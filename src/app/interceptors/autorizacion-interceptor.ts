import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Users } from '../services/users';
import { Observable } from 'rxjs';

@Injectable()
export class AutorizacionInterceptor implements HttpInterceptor {
  
  constructor (private userService: Users) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let token = this.userService.getTokenActual();
    if (token) {
      let clonRequest = req.clone ({
        headers: req.headers.set("Authorization","Bearer "+token)
      });
      return next.handle(clonRequest);
    }
    return next.handle(req);
  }
}

/*export const autorizacionInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};*/