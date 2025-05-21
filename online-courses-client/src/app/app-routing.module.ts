import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './register/register.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes  = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:id', component: CourseDetailsComponent, data: { renderMode: 'default' } },
  { path: 'admin/courses', component: AdminCoursesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
