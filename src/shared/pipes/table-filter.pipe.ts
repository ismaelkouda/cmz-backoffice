import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tableFilter',
})
export class TableFilterPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (!value) return null;
        if (!args) return null;
        args = args.toLowerCase();
        return value.filter((item) => {
            return JSON.stringify(item).toLowerCase().includes(args);
        });
    }
}
