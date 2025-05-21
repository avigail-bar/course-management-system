import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../core/services/course.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Lesson } from '../models/lesson.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    RouterLink,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
  courseId: number | null = null;
  course: any;
  lessons: Lesson[] = [];
  newLessonTitle: string = '';
  editingLesson: Lesson | null = null;
  private routeSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.courseId = Number(params.get('id'));
      if (this.courseId) {
        this.loadCourseDetails(this.courseId);
        this.loadCourseLessons(this.courseId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadCourseDetails(id: number) {
    this.courseService.getCourseById(id.toString()).subscribe(
      (data: any) => {
        this.course = data;
      },
      (error: any) => {
        this.snackBar.open('טעינת פרטי הקורס נכשלה.', 'סגור', { duration: 3000 });
      }
    );
  }

  loadCourseLessons(courseId: number) {
    this.courseService.getLessonsByCourseId(courseId).subscribe(
      (data: Lesson[]) => {
        this.lessons = data;
      },
      (error: any) => {
        this.snackBar.open('טעינת רשימת השיעורים נכשלה.', 'סגור', { duration: 3000 });
      }
    );
  }

  // אין addLessonToCourse ב-service שלך! אם יש צורך, יש להוסיף פונקציה כזו ל-service.
  // כאן דוגמה איך זה אמור להיראות אם תוסיף:

  addLesson() {
    if (!this.newLessonTitle.trim() || !this.courseId) return;
    this.courseService.addLessonToCourse(Number(this.courseId), { title: this.newLessonTitle, content: '' }).subscribe(
      (lesson: Lesson) => {
        this.lessons.push(lesson);
        this.newLessonTitle = '';
        this.snackBar.open('השיעור נוסף בהצלחה', 'סגור', { duration: 2000 });
      },
      (error: any) => {
        this.snackBar.open('הוספת השיעור נכשלה', 'סגור', { duration: 2000 });
      }
    );
  }
 

  startEditLesson(lesson: Lesson) {
    this.editingLesson = { ...lesson };
  }

  updateLesson() {
    if (!this.editingLesson || !this.editingLesson.id) return;
    this.courseService.updateLesson(Number(this.courseId), Number(this.editingLesson.id), this.editingLesson).subscribe(
      (updatedLesson: Lesson) => {
        const idx = this.lessons.findIndex(
          l => Number(l.id) === Number(updatedLesson.id)
        );
        if (idx > -1) this.lessons[idx] = updatedLesson;
        this.snackBar.open('השיעור עודכן', 'סגור', { duration: 2000 });
        this.editingLesson = null;
      },
      (error: any) => {
        this.snackBar.open('עדכון השיעור נכשל', 'סגור', { duration: 2000 });
      }
    );
  }

  cancelEditLesson() {
    this.editingLesson = null;
  }

  deleteLesson(lessonId: number): void {
    this.courseService.deleteLesson(this.courseId!, lessonId).subscribe(
      () => {
        this.lessons = this.lessons.filter(
          l => Number(l.id) !== Number(lessonId)
        );
        this.snackBar.open('השיעור נמחק', 'סגור', { duration: 2000 });
      },
      (error: any) => {
        this.snackBar.open('מחיקת השיעור נכשלה', 'סגור', { duration: 2000 });
      }
    );
  }
}