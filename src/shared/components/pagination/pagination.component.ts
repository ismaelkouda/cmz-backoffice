import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { PaginatorModule } from 'primeng/paginator';
@Component({
    selector: 'app-pagination',
    standalone: true,
    template: `
        <div class="d-flex justify-content-between align-items-center">
            <h2>
                <strong
                        style="position: absolute;left: 1.6%;font-size:18px;"
                    >
                        Total : {{ pagination?.total }}
                    </strong>
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
