import { Component, Input } from '@angular/core';

@Component({selector: 'app-spinner', templateUrl: './spinner.component.html'})

export class SpinnerComponent {
  @Input() spinnerTable: boolean;
  @Input() spinnerNextPage: boolean;
  @Input() listItems: Array<Object>;
}
