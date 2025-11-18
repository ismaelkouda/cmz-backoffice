import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { Paginate } from '../../interfaces/paginate';
@Component({
    selector: 'app-pagination',
    standalone: true,
    template: `
        <div class="d-flex justify-content-between">
            <h2 style="margin-top: 2rem;">
                <div class="row">
                    <strong
                        style="position: absolute;left: 1.6%;font-size:18px;"
                    >
                        Total : {{ pagination?.total }}
                    </strong>
                </div>
            </h2>
            <div>
                <p-paginator
                    (onPageChange)="onPageChange($event['page'])"
                    [rows]="pagination?.per_page"
                    [totalRecords]="pagination?.total"
                    [first]="pagination?.to - 1"
                    [pageLinkSize]="9"
                ></p-paginator>
            </div>
        </div>
    `,
    imports: [PaginatorModule],
})
export class PaginationComponent {
    @Input() pagination!: Paginate<any>;
    @Output() pageChange = new EventEmitter<number>();

    onPageChange(event: number) {
        this.pageChange.emit(event);
    }
}
