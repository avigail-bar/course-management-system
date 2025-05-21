import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

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
  public loggedInUserId$ = this.loggedInUserIdSubject.asObservable(); // Observable לקבלת userId
  private authToken: string | null = null;
  private userRoleSubject = new BehaviorSubject<string | null>(null); // Subject לשמירת תפקיד המשתמש
  public userRole$ = this.userRoleSubject.asObservable(); // Observable לקבלת תפקיד המשתמש

  constructor(private http: HttpClient) {
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
        this.authToken = storedToken;
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
      this.authToken = response.token;
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
          this.authToken = response.token;
          this.userRoleSubject.next(response.role); // עדכון ה-Subject עם הרול
        }
      })
    );
  }

  getLoggedInUserId(): string | null {
    return this.loggedInUserIdSubject.value;
  }

  getToken(): string | null {
    return this.authToken;
  }

  get isLoggedIn(): boolean {
    return !!this.authToken;
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
    this.authToken = null;
    this.userRoleSubject.next(null); // איפוס ה-Subject של הרול
  }
  getUserNameById(userId: string): Observable<string> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // שימי לב לשימוש ב-usersApiUrl
    return this.http.get<{ name: string }>(`${this.usersApiUrl}/${userId}`, { headers })
      .pipe(map(response => response.name));
  }

  // פונקציות נוספות לשמירת טוקן, קבלת טוקן, בדיקת סטטוס התחברות וכו' יכולות לבוא כאן
}