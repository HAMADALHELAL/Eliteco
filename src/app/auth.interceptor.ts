// src/app/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable } from 'rxjs';

/** Functional interceptor (keep if you’re using withInterceptors elsewhere) */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};

/** Class interceptor used by app.config.ts via HTTP_INTERCEPTORS */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');
    const cloned = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
    return next.handle(cloned);
  }
}
