import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    EventEmitter,
    inject,
    input,
    Input,
    Output,
    signal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';

import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { SeparatorThousandsPipe } from '@shared/pipes/separator-thousands.pipe';

@Component({
    selector: 'app-pagination',
    standalone: true,
    template: `
        <div class="d-flex justify-content-between align-items-center">
            <h2>
                <strong>
                    {{ 'PAGINATION.TOTAL' | translate }} :
                    {{ pagination()?.total | separatorThousandsPipe }}
                </strong>
            </h2>
            <div class="pagination-wrapper">
                <p-paginator
                    (onPageChange)="onPageChange($event)"
                    [rows]="rowsPerPage()"
                    [totalRecords]="totalRecords()"
                    [first]="firstRecordIndex()"
                    [pageLinkSize]="pageLinkSize()"
                    [showCurrentPageReport]="showCurrentPageReport()"
                    [showJumpToPageDropdown]="showJumpToPage()"
                    [currentPageReportTemplate]="currentPageReportTemplate()"
                    [showFirstLastIcon]="true"
                    styleClass="intuitive-paginator"
                ></p-paginator>
            </div>
        </div>
    `,

    styleUrls: ['./pagination.component.scss'],
    imports: [
        CommonModule,
        PaginatorModule,
        TranslateModule,
        SeparatorThousandsPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
    private readonly translateService = inject(TranslateService);
    public readonly pagination = input.required<Paginate<undefined>>();

    @Output() pageChange = new EventEmitter<number>();
    @Output() rowsPerPageChange = new EventEmitter<number>();

    @Input() defaultRows = 10;
    @Input() rowsPerPageOptions = [10, 20, 50, 100];
    public readonly showJumpToPage = input<boolean>(false);
    public readonly pageLinkSize = input<number>(5);
    public readonly showCurrentPageReport = input<boolean>(true);

    readonly totalRecords = computed(() => this.pagination()?.total || 0);
    readonly rowsPerPage = computed(
        () => this.pagination()?.per_page || this.defaultRows
    );
    readonly currentPage = computed(() => this.pagination()?.current_page || 1);

    readonly firstRecordIndex = computed(() => {
        if (!this.pagination()?.current_page) {
            return 0;
        }
        return (this.pagination().current_page - 1) * this.rowsPerPage();
    });

    readonly currentPageReportTemplate = signal<string>('');

    constructor() {
        effect(() => {
            this.updateCurrentPageReportTemplate();
        });

        this.translateService.onLangChange.subscribe(() => {
            this.updateCurrentPageReportTemplate();
        });
    }

    private updateCurrentPageReportTemplate(): void {
        const showing = this.translateService.instant('PAGINATION.SHOWING');
        const to = this.translateService.instant('PAGINATION.TO');
        const of = this.translateService.instant('PAGINATION.OF');
        const entries = this.translateService.instant('PAGINATION.ENTRIES');

        const template = `${showing} {first} ${to} {last} ${of} {totalRecords} ${entries}`;
        this.currentPageReportTemplate.set(template);
    }

    onPageChange(event: any): void {
        const pageNumber = event.page;
        this.pageChange.emit(pageNumber);

        if (event.rows && event.rows !== this.rowsPerPage()) {
            this.rowsPerPageChange.emit(event.rows);
        }
    }
}
