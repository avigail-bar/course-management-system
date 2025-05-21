import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // ייבוא HttpHeaders
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Course } from '../../models/course.model';
import { Lesson } from '../../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getEnrolledCoursesForUser(): Observable<any[]> {
    const userId = this.authService.getLoggedInUserId();
    return this.http.get<any[]>(`${this.apiUrl}/student/${userId}`, { headers: this.getAuthHeaders() });
  }

  joinCourse(courseId: number): Observable<any> {
    const userId = this.authService.getLoggedInUserId();
    return this.http.post(`${this.apiUrl}/${courseId}/enroll`, { userId }, { headers: this.getAuthHeaders() });
  }

  leaveCourse(courseId: number): Observable<any> {
    const userId = this.authService.getLoggedInUserId();
    return this.http.delete(`${this.apiUrl}/${courseId}/unenroll`, { headers: this.getAuthHeaders(), body: { userId } });
  }

  createCourse(courseData: { title: string; description: string; teacherId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, courseData, { headers: this.getAuthHeaders() });
  }

  updateCourse(courseId: number, courseData: { title: string; description: string; teacherId?: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${courseId}`, courseData, { headers: this.getAuthHeaders() });
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${courseId}`, { headers: this.getAuthHeaders() });
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl, { headers: this.getAuthHeaders() }); // ייתכן שנקודת קצה זו לא דורשת אימות
  }

  getAllCoursesWithLessons(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}?_embed=lessons`, { headers: this.getAuthHeaders() }); // ייתכן שנקודת קצה זו לא דורשת אימות
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getLessonsByCourseId(courseId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/${courseId}/lessons`, { headers: this.getAuthHeaders() });
  }

  updateLesson(courseId: number, lessonId: number, lessonData: { title: string; content: string }): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${courseId}/lessons/${lessonId}`,
      { ...lessonData, courseId },
      { headers: this.getAuthHeaders() }
    );
  }

  deleteLesson(courseId: number, lessonId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${courseId}/lessons/${lessonId}`,
      { headers: this.getAuthHeaders() }
    );
  }
  addLessonToCourse(courseId: number, lessonData: { title: string; content: string }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${courseId}/lessons`,
      { ...lessonData, courseId },
      { headers: this.getAuthHeaders() }
    );
  }
  getLessonById(courseId: number, lessonId: number): Observable<Lesson> {
    return this.http.get<Lesson>(
      `${this.apiUrl}/${courseId}/lessons/${lessonId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}