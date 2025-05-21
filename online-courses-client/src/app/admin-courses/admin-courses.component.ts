import { Component, OnInit, OnDestroy, ViewChild, ElementRef   } from '@angular/core';
import { CourseService } from '../core/services/course.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Course } from '../models/course.model';
import { Lesson } from '../models/lesson.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../core/services/auth.service';
import { LessonItemComponent } from "./lesson-item/lesson-item.component";

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
    MatExpansionModule,
    LessonItemComponent
],
  templateUrl: './admin-courses.component.html',
  styleUrl: './admin-courses.component.css'
})
export class AdminCoursesComponent implements OnInit, OnDestroy {
  @ViewChild('editCourseCard') editCourseCard!: ElementRef;
  courses: Course[] = [];
  addCourseForm: FormGroup;
  editingCourse: Course | null = null;
  editCourseForm: FormGroup;
  editingLesson: Lesson | null = null;
  editLessonForm: FormGroup;
  private courseSubscription: Subscription | undefined;
  private lessonSubscription: Subscription | undefined;
  showAddCourseForm = false;
  userId: number | string | null = null;
  private userIdSubscription: Subscription | undefined;
  selectedCourse: Course | null = null;
  selectedCourseLessons: Lesson[] = [];
  showAddLessonForm = false; // האם להציג את טופס הוספת שיעור
  addLessonForm: FormGroup;  // טופס להוספת שיעור

  constructor(
    private courseService: CourseService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    
  ) {
    this.addCourseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.editCourseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.editLessonForm = this.fb.group({
      title: ['', Validators.required]
    });
    this.addLessonForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required] // הוספת שדה תוכן
    });
  }

  toggleAddLessonForm() {
    this.showAddLessonForm = !this.showAddLessonForm;
    this.addLessonForm.reset();
  }

  addLesson() {
    if (this.addLessonForm.valid && this.selectedCourse?.id !== undefined) {
      console.log('addLessonToCourse params:', this.selectedCourse.id, this.addLessonForm.value);
      this.courseService.addLessonToCourse(
        this.selectedCourse.id,
        this.addLessonForm.value
      ).subscribe(
        (response) => {
          this.snackBar.open('השיעור נוסף בהצלחה!', 'סגור', { duration: 3000 });
          this.openCourse(this.selectedCourse!); // רענון רשימת שיעורים לקורס הפתוח
          this.toggleAddLessonForm();
        },
        (error) => {
          console.error('Add lesson error:', error);
          this.snackBar.open('הוספת השיעור נכשלה.', 'סגור', { duration: 3000 });
        }
      );
    }
  }

  ngOnInit(): void {
    // קבלת מזהה המשתמש המחובר
    this.userIdSubscription = this.authService.loggedInUserId$.subscribe(userId => {
      this.userId = userId;
      this.loadCoursesWithLessons();
    });
    this.loadCoursesWithLessons();
  }

  ngOnDestroy(): void {
    if (this.courseSubscription) {
      this.courseSubscription.unsubscribe();
    }
    if (this.lessonSubscription) {
      this.lessonSubscription.unsubscribe();
    }
  }

  loadCoursesWithLessons() {
    this.courseSubscription = this.courseService.getAllCoursesWithLessons().subscribe(
      (data) => {
        this.courses = data;
      },
      (error) => {
        this.snackBar.open('טעינת הקורסים והשיעורים נכשלה.', 'סגור', { duration: 3000 });
      }
    );
  }

  toggleAddCourseForm() {
    this.showAddCourseForm = !this.showAddCourseForm;
    this.addCourseForm.reset();
  }
  openCourse(course: Course) {
    this.selectedCourse = course;
    this.courseService.getLessonsByCourseId(course.id!).subscribe(lessons => {
      this.selectedCourseLessons = lessons;
    });
  }

  addCourse() {
    if (this.addCourseForm.valid) {
      // הוספת מזהה המורה לקורס החדש
      const newCourse: Course = {
        ...this.addCourseForm.value,
        teacherId: this.userId
      };
      this.courseService.createCourse(newCourse).subscribe(
        (response) => {
          this.snackBar.open('הקורס נוסף בהצלחה!', 'סגור', { duration: 3000 });
          this.loadCoursesWithLessons();
          this.addCourseForm.reset();
          this.showAddCourseForm = false;
        },
        (error) => {
          this.snackBar.open('הוספת הקורס נכשלה.', 'סגור', { duration: 3000 });
        }
      );
    }
  }

  editCourse(course: Course) {
    this.editingCourse = { ...course };
    this.editCourseForm.patchValue({
      title: this.editingCourse.title,
      description: this.editingCourse.description
    });
  }

  updateCourse() {
    if (this.editCourseForm.valid && this.editingCourse?.id !== undefined) {
      const courseIdToUpdate = this.editingCourse.id;
      const updatedCourse: Course = { ...this.editingCourse, ...this.editCourseForm.value };
      this.courseService.updateCourse(courseIdToUpdate, updatedCourse).subscribe(
        (response) => {
          this.snackBar.open('הקורס עודכן בהצלחה!', 'סגור', { duration: 3000 });
          this.loadCoursesWithLessons();
          this.cancelEdit();
        },
        (error) => {
          this.snackBar.open('עדכון הקורס נכשל.', 'סגור', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('יש למלא את כל השדות ולבחור קורס לעריכה לפני השמירה.', 'סגור', { duration: 3000 });
    }
  }

  deleteCourse(courseId: number | undefined) {
    if (typeof courseId === 'number') {
      this.courseService.deleteCourse(courseId).subscribe(
        (response) => {
          this.snackBar.open('הקורס נמחק בהצלחה!', 'סגור', { duration: 3000 });
          this.courses = this.courses.filter(course => course.id !== courseId);
        },
        (error) => {
          this.snackBar.open('מחיקת הקורס נכשלה.', 'סגור', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('לא ניתן למחוק את הקורס: מזהה לא תקין.', 'סגור', { duration: 3000 });
    }
  }

  cancelEdit() {
    this.editingCourse = null;
    this.editCourseForm.reset();
  }

  editLesson(lesson: Lesson) {
    this.editingLesson = { ...lesson };
    this.editLessonForm.patchValue({
      title: this.editingLesson.title
    });
  }

  updateLesson() {
    if (this.editLessonForm.valid && this.editingLesson?.id !== undefined) {
      const lessonIdToUpdate = this.editingLesson.id;
      const updatedLesson: Lesson = { ...this.editingLesson, ...this.editLessonForm.value };
      this.courseService.updateLesson(
        updatedLesson.courseId, // או מאיפה שאת שומרת את מזהה הקורס
        lessonIdToUpdate,
        {
          title: updatedLesson.title,
          content: updatedLesson.content
        }
      ).subscribe(
        (response) => {
          this.snackBar.open('השיעור עודכן בהצלחה!', 'סגור', { duration: 3000 });
          this.loadCoursesWithLessons();
          this.cancelEditLesson();
        },
        (error) => {
          this.snackBar.open('עדכון השיעור נכשל.', 'סגור', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('יש למלא את כל השדות ולבחור שיעור לעריכה לפני השמירה.', 'סגור', { duration: 3000 });
    }
  }

  deleteLesson(lessonId: number | undefined) {
    if (typeof lessonId === 'number' && this.selectedCourse) {
      this.courseService.deleteLesson(this.selectedCourse.id!, lessonId).subscribe(
        (response) => {
          this.snackBar.open('השיעור נמחק בהצלחה!', 'סגור', { duration: 3000 });
          this.loadCoursesWithLessons();
        },
        (error) => {
          this.snackBar.open('מחיקת השיעור נכשלה.', 'סגור', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('מזהה שיעור או קורס לא תקין עבור מחיקה.', 'סגור', { duration: 3000 });
    }
  }

  cancelEditLesson() {
    this.editingLesson = null;
    this.editLessonForm.reset();
  }

  isTeacher(): boolean {
    return this.authService.getRole() === 'teacher';
  }

  // פונקציה: האם המשתמש הנוכחי מורשה לערוך/למחוק קורס זה
  canEditOrDelete(course: Course): boolean {
    console.log('userId:', this.userId, 'course.teacherId:', course.teacherId, 'isTeacher:', this.isTeacher());
    /*return this.isTeacher() && course.teacherId === this.userId;*/
    return true;
  }
  startEditCourse(course: Course) {
    this.editingCourse = course;
    setTimeout(() => {
      if (this.editCourseCard) {
        this.editCourseCard.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100); // תני קצת יותר זמן ל-ngIf ליצור את האלמנט
  }

  scrollToEditCourse() {
    if (this.editCourseCard) {
      this.editCourseCard.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}