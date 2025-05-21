import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // ודאי שהנתיב ל-AuthService נכון

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // נבדוק אם יש טוקן (או אם המשתמש מחובר דרך ה-AuthService)
    // הנחה: ל-AuthService יש מתודה isAuthenticated() או isUserLoggedIn()
    // שבודקת אם קיים טוקן תקף או שהמשתמש מחובר.
    // אם אין מתודה כזו, נצטרך להוסיף אותה ל-AuthService או לבדוק כאן ישירות את localStorage.

    if (this.authService.isLoggedIn) { // או שם מתודה דומה
      return true; // המשתמש מחובר, אפשר לגשת לנתיב
    } else {
      // המשתמש לא מחובר, הפנה אותו לדף ההתחברות
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      // queryParams: returnUrl - אופציונלי, כדי להחזיר את המשתמש לדף שניסה לגשת אליו לאחר ההתחברות
      return false;
    }
  }
}