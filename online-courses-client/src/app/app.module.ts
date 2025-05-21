import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // אם יש לך Routing
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthInterceptor } from './core/services/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule, // ודא ש-AppRoutingModule מייבא את הקומפוננטות העצמאיות שאתה משתמש בהן בנתיבים
    ReactiveFormsModule,
    LoginComponent, // ייבוא ישיר של קומפוננטה עצמאית
    RegisterComponent, // ייבוא ישיר של קומפוננטה עצמאית
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [], // הגדרת רכיב השורש
})
export class AppModule { }