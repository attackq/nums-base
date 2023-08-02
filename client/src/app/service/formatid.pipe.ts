import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatid',
})
export class FormatIdPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    value = value.toString();
    switch (value.length) {
      case 1:
        return '00' + value;
      case 2:
        return '0' + value;
      default:
        return value;
    }
  }
}
