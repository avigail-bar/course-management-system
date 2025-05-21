import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { CourseService } from '../core/services/course.service';
import { AuthService } from '../core/services/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { TruncatePipe } from "../../shared/truncate.pipe";

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatCardModule, RouterLink, TruncatePipe],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: any[] = [];
  UserId: string | null = null;
  enrolledCourses: { [courseId: number]: boolean } = {};
  private userIdSubscription: Subscription | undefined;
  joiningCourseId: number | null = null;
  leavingCourseId: number | null = null;

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userIdSubscription = this.authService.loggedInUserId$.subscribe(userId => {
      this.UserId = userId;
      if (this.UserId) {
        this.loadCoursesAndEnrollmentStatus();
        this.loadUserEnrolledCourses(); // תיקון: קריאה ללא ארגומנט
        console.log('User Role:', this.authService.getRole());
      } else {
        this.courses = [];
        this.enrolledCourses = {};
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }

  isTeacher(): boolean {
    return this.authService.getRole() === 'teacher';
  }

  loadCoursesAndEnrollmentStatus(): void {
    this.courseService.getAllCourses().subscribe(
      (courses) => {
        console.log('All courses:', courses);
        this.courses = courses;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  loadUserEnrolledCourses(): void { // תיקון: הסרת פרמטר לא נחוץ
    if (this.UserId) {
      this.courseService.getEnrolledCoursesForUser().subscribe(
        (enrolledCoursesData) => {
          this.enrolledCourses = {};
          enrolledCoursesData.forEach(course => {
            this.enrolledCourses[course.id] = true;
          });
          console.log('User enrolled courses:', this.enrolledCourses);
        },
        (error) => {
          console.error('Failed to load user enrolled courses', error);
          this.snackBar.open('טעינת רשימת הקורסים שלך נכשלה.', 'סגור', { duration: 3000 });
        }
      );
    }
  }

  joinCourse(course: any): void { // הפונקציה מקבלת 'course' כארגומנט
    if (this.UserId && this.joiningCourseId !== course.id) {
      this.joiningCourseId = course.id;
      this.courseService.joinCourse(course.id).subscribe(
        (response) => {
          console.log('Joined course:', response);
          this.loadUserEnrolledCourses();
          this.joiningCourseId = null;
          this.snackBar.open('הצטרפת לקורס בהצלחה!', 'סגור', { duration: 3000 });
        },
        (error) => {
          console.error('Failed to join course', error);
          this.joiningCourseId = null;
          this.snackBar.open('הצטרפות לקורס נכשלה.', 'סגור', { duration: 3000 });
          if (error.status === 409) {
            this.snackBar.open('אתה כבר רשום לקורס זה.', 'סגור', { duration: 3000 });
          }
        }
      );
    }
  }

  leaveCourse(course: any): void { // הפונקציה מקבלת 'course' כארגומנט
    if (this.UserId && this.leavingCourseId !== course.id) {
      this.leavingCourseId = course.id;
      this.courseService.leaveCourse(course.id).subscribe(
        (response) => {
          console.log('Left course:', response);
          this.loadUserEnrolledCourses();
          this.leavingCourseId = null;
          this.snackBar.open('עזבת את הקורס בהצלחה.', 'סגור', { duration: 3000 });
        },
        (error) => {
          console.error('Failed to leave course', error);
          this.leavingCourseId = null;
          this.snackBar.open('עזיבת הקורס נכשלה.', 'סגור', { duration: 3000 });
        }
      );
    }
  }

  isUserEnrolled(course: any): boolean {
    return this.enrolledCourses[course.id] === true;
  }

  isJoining(courseId: number): boolean {
    return this.joiningCourseId === courseId;
  }

  isLeaving(courseId: number): boolean {
    return this.leavingCourseId === courseId;
  }
}