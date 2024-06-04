import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pargination',
  template: `
  <div class="d-flex justify-content-between">
    <h2 style="margin-top: 2rem;">
        <div class="row">
            <strong style="position: absolute;left: 1.6%;font-size:18px;">
                Total : {{pargination?.total}}
            </strong>
        </div>
    </h2>
    <div>
        <p-paginator (onPageChange)="onPageChange($event['page'])" [rows]="pargination?.per_page"
            [totalRecords]="pargination?.total" [first]="pargination?.to - 1" [pageLinkSize]="9"></p-paginator>
    </div>
  </div>
  `,
  styles: [`
    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
      background: #FF6600;
      border-color: #FF6600;
      color: #000000;
    }
  `]
})
export class ParginationComponent {
  @Input() pargination;
  @Output() pageChange= new EventEmitter<number>();

  onPageChange(event: number) {
    this.pageChange.emit(event);
  }

}
