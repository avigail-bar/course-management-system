import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Lesson } from '../../models/lesson.model'; // עדכני נתיב אם צריך
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lesson-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './lesson-item.component.html',
  styleUrls: ['./lesson-item.component.css']
})
export class LessonItemComponent {
  @Input() lesson!: Lesson;
  @Input() canEditOrDelete: boolean = false;
  @Output() deleted = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Lesson>();

  onDelete() {
    this.deleted.emit(this.lesson.id);
  }

  onEdit() {
    this.edit.emit(this.lesson);
  }
}