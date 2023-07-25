import { Injectable } from '@nestjs/common';

@Injectable()
export class DateFormatHelper {
  format(date: Date): string {
    date.setHours(date.getHours() - 5);
    const strDate = date.toISOString().split('.')[0] + '-05:00';
    return strDate;
  }
}
