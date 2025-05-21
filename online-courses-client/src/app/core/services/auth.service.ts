import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, filter, take, switchMap } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: string;
  userId: string;
  role: string; // הוסף את שדה הרול אם השרת שולח אותו בתגובה
  // יכולים להיות שדות נוספים כאן בהתאם לתגובה מהשרת שלך
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // בסיס ה-URL עבור אוטנטיקציה
  private usersApiUrl = 'http://localhost:3000/api/users';

  private loggedInUserIdSubject = new BehaviorSubject<string | null>(null); // Subject לשמירת userId
  public loggedInUserId$ = this.loggedInUserIdSubject.asObservable();
  private authTokenSubject = new BehaviorSubject<string | null>(null);
  public authToken$ = this.authTokenSubject.asObservable();
  private userRoleSubject = new BehaviorSubject<string | null>(null); // Subject לשמירת תפקיד המשתמש
  public userRole$ = this.userRoleSubject.asObservable(); // Observable לקבלת תפקיד המשתמש

  constructor(private http: HttpClient, private router: Router,) {
    this.loadTokenAndUserIdAndRoleFromLocalStorage();
  }

  private loadTokenAndUserIdAndRoleFromLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      const storedToken = localStorage.getItem('authToken');
      const storedRole = localStorage.getItem('userRole');
      if (storedUserId) {
        this.loggedInUserIdSubject.next(storedUserId);
      }
      if (storedToken) {
        this.authTokenSubject.next(storedToken);
      }
      if (storedRole) {
        this.userRoleSubject.next(storedRole);
      }
    }
  }

  login(credentials: any): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
    tap((response: LoginResponse) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('authToken', response.token); // שמירה של טוקן בלבד
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('userRole', response.role); // שמירה של תפקיד המשתמש
      }
      this.loggedInUserIdSubject.next(response.userId);
      this.authTokenSubject.next(response.token);
      this.userRoleSubject.next(response.role); // עדכון ה-Subject עם הרול
    })
  );
}


  register(userData: any): Observable<any> {
    const registerUrl = `${this.apiUrl}/register`;
    console.log('Register URL from service:', registerUrl);
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response && response.userId && response.token && response.role) { // ודא שהרול קיים בתגובה
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userRole', response.role); // שמירת הרול בלוקל סטורג'
          }
          this.loggedInUserIdSubject.next(response.userId);
          this.authTokenSubject.next(response.token);
          this.userRoleSubject.next(response.role); // עדכון ה-Subject עם הרול
        }
      })
    );
  }

  getLoggedInUserId(): string | null {
    return this.loggedInUserIdSubject.value;
  }

  getToken(): string | null {
    return this.authTokenSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.authTokenSubject.value;
  }

  getRole(): string | null {
    return this.userRoleSubject.value;
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('userId');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole'); // הסרת הרול מלוקל סטורג' בעת התנתקות
    }
    this.loggedInUserIdSubject.next(null);
    this.authTokenSubject.next(null);
    this.userRoleSubject.next(null); // איפוס ה-Subject של הרול
    this.router.navigate(['/login']);
    }

    getUserNameById(userId: string): Observable<string> {
      return this.authToken$.pipe(
        filter((token): token is string => token !== null), // המתן עד שהטוקן אינו null
        take(1), // קח את הערך הראשון שעונה על התנאי והשלם
        switchMap(token => { // לאחר שיש טוקן, בצע את קריאת ה-HTTP
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          return this.http.get<{ name: string }>(`${this.usersApiUrl}/${userId}`, { headers })
            .pipe(map(response => response.name));
        })
      );
    }

  // פונקציות נוספות לשמירת טוקן, קבלת טוקן, בדיקת סטטוס התחברות וכו' יכולות לבוא כאן
}