/*
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatInputModule,
    MatFormFieldModule, MatButtonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  registrationSuccess: boolean = false;
  registrationError: string = '';

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['student']
    }, // שונה מ-'user' ל-'student' כערך ברירת מחדל
      { validators: this.passwordMatchValidator });
  }
  get fullNameControl() { return this.registerForm.controls['fullName']; }
  get emailControl() { return this.registerForm.controls['email']; }
  get passwordControl() { return this.registerForm.controls['password']; }
  get confirmPasswordControl() { return this.registerForm.controls['confirmPassword']; }
  get roleControl() { return this.registerForm.controls['role']; } // Getter עבור שדה התפקיד

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const passwordControl = group.controls['password'];
    const confirmPasswordControl = group.controls['confirmPassword'];

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      return { 'mismatch': true };
    }
    return null;
  }

  onSubmit() {
  console.log('onSubmit function called');
  if (this.registerForm.valid) {
    const formData = this.registerForm.value;
    delete formData.confirmPassword;

    const registrationData = {
      name: formData.fullName, // שינוי מ-fullName ל-name
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    console.log('Data being sent to server:', registrationData);

    this.authService.register(registrationData)
      .subscribe(
        (response: any) => {
          console.log('Registration successful', response);
          this.registrationSuccess = true;
          this.registrationError = '';
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        (error: HttpErrorResponse) => {
          console.error('Registration failed', error);
          this.registrationSuccess = false;
          this.registrationError = 'Registration failed. Please try again.';
          if (error.error && error.error.message) {
            this.registrationError = error.error.message;
          }
        }
      );

  } else {
    this.registrationError = 'Please fill in all required fields correctly.';
    this.registrationSuccess = false;
  }
}
}
*/
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink 
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  registrationSuccess = false;
  registrationError = '';
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['student']
    }, { validators: this.passwordMatchValidator });
  }

  get fullNameControl() { return this.registerForm.get('fullName'); }
  get emailControl() { return this.registerForm.get('email'); }
  get passwordControl() { return this.registerForm.get('password'); }
  get confirmPasswordControl() { return this.registerForm.get('confirmPassword'); }
  get roleControl() { return this.registerForm.get('role'); }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { fullName, email, password, role } = this.registerForm.value;
      const registrationData = { name: fullName, email, password, role };

      this.authService.register(registrationData).subscribe({
        next: () => {
          this.registrationSuccess = true;
          this.registrationError = '';
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.registrationError = error.error?.message || 'Registration failed. Please try again.';
          this.registrationSuccess = false;
        }
      });
    } else {
      this.registrationError = 'יש למלא את כל השדות כנדרש.';
      this.registrationSuccess = false;
    }
  }
}
