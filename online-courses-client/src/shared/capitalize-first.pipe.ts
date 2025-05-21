import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirst'
})
export class CapitalizeFirstPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    // אם יש רווחים מיותרים, נסיר אותם
    value = value.trim();
    // נחליף רק את האות הראשונה
    return value.charAt(0).toLocaleUpperCase() + value.slice(1);
  }
}