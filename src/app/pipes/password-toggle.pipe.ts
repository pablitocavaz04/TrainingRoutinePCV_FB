import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordToggle',
})
export class PasswordTogglePipe implements PipeTransform {
  transform(showPassword: boolean): string {
    return showPassword ? 'text' : 'password';
  }
}
