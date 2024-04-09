import { Pipe, PipeTransform } from '@angular/core';
import { formatterNombre } from '../constants/formatterNombre.constant';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number, decimalPlaces: number = 2): string {
    // Utiliser la fonction formatNumber définie précédemment
    return formatterNombre(value,decimalPlaces);
  }
}