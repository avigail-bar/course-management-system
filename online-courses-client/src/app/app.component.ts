import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';



@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet,RouterModule,MatToolbarModule, MatButtonModule, MatIconModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'online-courses-client';

  constructor(public authService: AuthService) {}
  
  get isLoggedIn(): boolean { // הוספת getter
    return this.authService.isLoggedIn;
  }

  logout(): void {
    this.authService.logout();
  }
}
