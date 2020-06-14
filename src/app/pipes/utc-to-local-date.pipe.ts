import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'utcToLocalDate',
    pure: false
})
export class UtcToLocalDatePipe implements PipeTransform {
    constructor() {
    }

    transform(date: any): any {
        // let newDate, offset, hours;
        // if (date) {
        //     if (!(date instanceof Date)) {
        //         date = new Date(date.toString());
        //     }
        //     newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        //
        //     offset = date.getTimezoneOffset() / 60;
        //     hours = date.getHours();
        //     newDate.setHours(hours - offset);
        //     console.log(newDate);
        //     return newDate;
        // }
        // return null;
        return date;
    }
}
