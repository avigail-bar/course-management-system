import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // לא נכניס טוקן בבקשות login או register
    if (req.url.includes('/login') || req.url.includes('/register')) {
      return next.handle(req);
    }

    const token = localStorage.getItem('authToken'); // חשוב: אותו מפתח ששמרת בו
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    } else {
      return next.handle(req); // אין טוקן? שולחים בלי כותר
    }
  }
}
