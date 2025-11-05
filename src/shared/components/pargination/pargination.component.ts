import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { Paginate } from '../../interfaces/paginate';
@Component({
    selector: 'app-pargination',
    standalone: true,
    template: `
        <div class="d-flex justify-content-between">
            <h2 style="margin-top: 2rem;">
                <div class="row">
                    <strong
                        style="position: absolute;left: 1.6%;font-size:18px;"
                    >
                        Total : {{ pargination?.total }}
                    </strong>
                </div>
            </h2>
            <div>
                <p-paginator
                    (onPageChange)="onPageChange($event['page'])"
                    [rows]="pargination?.per_page"
                    [totalRecords]="pargination?.total"
                    [first]="pargination?.to - 1"
                    [pageLinkSize]="9"
                ></p-paginator>
            </div>
        </div>
    `,
    imports: [PaginatorModule],
})
export class ParginationComponent {
    @Input() pargination!: Paginate<any>;
    @Output() pageChange = new EventEmitter<number>();

    onPageChange(event: number) {
        this.pageChange.emit(event);
    }
}
