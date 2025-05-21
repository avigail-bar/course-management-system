import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule, // אופציונלי
    MatIconModule, // אופציונלי
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  hidePassword = true; // לשליטה על נראות הסיסמה

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get emailControl() {
    return this.loginForm.controls['email'] as FormControl;
  }

  get passwordControl() {
    return this.loginForm.controls['password'] as FormControl;
  }

  onSubmit() {
  if (this.loginForm.valid) {
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successful!', response);

        // נוסיף את השורה הזו כדי לשמור את הטוקן ב-localStorage
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
        }

        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'ההתחברות נכשלה. אנא בדוק את האימייל והסיסמה.';
      }
    });
  } else {
    this.errorMessage = 'אנא מלא את כל השדות בצורה תקינה.';
  }
}

}