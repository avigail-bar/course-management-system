import { Lesson } from "./lesson.model";

export interface Course {
  id?: number; // סימן שאלה (?) מציין שזה יכול להיות אופציונלי (למשל, לפני שהקורס נוצר בשרת)
  title: string;
  description: string;
  teacherId: number;
  lessons?: Lesson[]; 
}