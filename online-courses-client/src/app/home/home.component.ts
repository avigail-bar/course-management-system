import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CapitalizeFirstPipe } from "../../shared/capitalize-first.pipe";
import { AuthService } from '../core/services/auth.service';// נתיב
  import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CapitalizeFirstPipe,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  userName: string = ''; // ברירת מחדל ריק

  constructor(public authService: AuthService) {}

  ngOnInit() {
    const userId = this.authService.getLoggedInUserId();
if (userId) {
  this.authService.getUserNameById(userId).subscribe(name => {
    this.userName = name;
  });
} else {
  // טיפול במקרה שאין משתמש מחובר
  this.userName = '';
}
  }
}
