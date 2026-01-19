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
    signal
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { SeparatorThousandsPipe } from '@shared/pipes/separator-thousands.pipe';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    selector: 'app-pagination',
    standalone: true,
    template: `
            <div class="d-flex justify-content-between align-items-center">
                <h2>
                    <strong>
                        {{ 'PAGINATION.TOTAL' | translate }} : {{ (pagination()?.total) | separatorThousandsPipe }}
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

    styles: [
        `
            .pagination-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1rem 0;
                position: relative;
                min-height: 60px;
            }

            :host ::ng-deep .intuitive-paginator {
                background: transparent;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 12px;
                background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                box-shadow:
                    0 2px 8px rgba(0, 0, 0, 0.06),
                    inset 0 1px 0 rgba(255, 255, 255, 0.8);
                border: 1px solid #e2e8f0;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
                justify-content: center;
            }

            :host ::ng-deep .intuitive-paginator:hover {
                box-shadow:
                    0 4px 16px rgba(0, 0, 0, 0.08),
                    inset 0 1px 0 rgba(255, 255, 255, 0.9);
                border-color: #cbd5e1;
                transform: translateY(-1px);
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-current {
                background: rgba(99, 102, 241, 0.08);
                border: none;
                color: #475569;
                font-size: 0.875rem;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                order: 1;
                min-width: 240px;
                text-align: center;
            }

            .pagination-info {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                white-space: nowrap;
            }

            .info-icon {
                font-size: 1rem;
                opacity: 0.7;
            }

            .divider {
                color: #cbd5e1;
                margin: 0 0.25rem;
                font-weight: 300;
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-first,
            :host ::ng-deep .intuitive-paginator .p-paginator-prev {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                border: 1.5px solid #e2e8f0;
                background: white;
                color: #64748b;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                order: 2;
            }
            :host ::ng-deep .intuitive-paginator .p-paginator-next,
            :host ::ng-deep .intuitive-paginator .p-paginator-last {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                border: 1.5px solid #e2e8f0;
                background: white;
                color: #64748b;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                order: 4;
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-first:hover,
            :host ::ng-deep .intuitive-paginator .p-paginator-prev:hover,
            :host ::ng-deep .intuitive-paginator .p-paginator-next:hover,
            :host ::ng-deep .intuitive-paginator .p-paginator-last:hover {
                background: #f1f5f9;
                border-color: #94a3b8;
                color: #334155;
                transform: scale(1.05);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-first:active,
            :host ::ng-deep .intuitive-paginator .p-paginator-prev:active,
            :host ::ng-deep .intuitive-paginator .p-paginator-next:active,
            :host ::ng-deep .intuitive-paginator .p-paginator-last:active {
                transform: scale(0.95);
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-first:disabled,
            :host ::ng-deep .intuitive-paginator .p-paginator-prev:disabled,
            :host ::ng-deep .intuitive-paginator .p-paginator-next:disabled,
            :host ::ng-deep .intuitive-paginator .p-paginator-last:disabled {
                opacity: 0.4;
                background: #f8fafc;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-first::before,
            :host ::ng-deep .intuitive-paginator .p-paginator-prev::before,
            :host ::ng-deep .intuitive-paginator .p-paginator-next::before,
            :host ::ng-deep .intuitive-paginator .p-paginator-last::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            :host
                ::ng-deep
                .intuitive-paginator
                .p-paginator-first:hover::before,
            :host
                ::ng-deep
                .intuitive-paginator
                .p-paginator-prev:hover::before,
            :host
                ::ng-deep
                .intuitive-paginator
                .p-paginator-next:hover::before,
            :host
                ::ng-deep
                .intuitive-paginator
                .p-paginator-last:hover::before {
                opacity: 1;
            }

            :host
                ::ng-deep
                .intuitive-paginator
                .p-paginator-page.p-paginator-page-selected {
                color: var(--color-white);
                background-color: var(--theme-default);
            }
            :host ::ng-deep .intuitive-paginator .p-paginator-pages {
                display: flex;
                gap: 0.25rem;
                order: 3;
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-page {
                min-width: 40px;
                height: 40px;
                border-radius: 10px;
                border: 1.5px solid #e2e8f0;
                background: white;
                color: #475569;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-page:hover {
                background: #f1f5f9;
                border-color: var(--theme-default);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-page.p-highlight {
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                color: white;
                border: none;
                box-shadow:
                    0 2px 8px rgba(99, 102, 241, 0.3),
                    0 0 0 1px rgba(99, 102, 241, 0.1) inset;
                transform: scale(1.05);
                z-index: 1;
            }

            :host
                ::ng-deep
                .intuitive-paginator
                .p-paginator-page.p-highlight::after {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                border-radius: 12px;
                z-index: -1;
                opacity: 0.2;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%,
                100% {
                    opacity: 0.2;
                }
                50% {
                    opacity: 0.4;
                }
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-rpp-options {
                order: 4;
                margin-left: 0.5rem;
            }

            :host ::ng-deep .intuitive-paginator .p-dropdown {
                border: 1.5px solid #e2e8f0;
                border-radius: 10px;
                background: white;
                transition: all 0.2s ease;
                min-width: 100px;
            }

            :host ::ng-deep .intuitive-paginator .p-dropdown:hover {
                border-color: #94a3b8;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            }

            :host
                ::ng-deep
                .intuitive-paginator
                .p-dropdown:not(.p-disabled).p-focus {
                border-color: #6366f1;
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-jump-to-page {
                order: 5;
            }

            :host
                ::ng-deep
                .intuitive-paginator
                .p-paginator-jump-to-page
                .p-inputtext {
                border: 1.5px solid #e2e8f0;
                border-radius: 10px;
                padding: 0.5rem 0.75rem;
                transition: all 0.2s ease;
                width: 80px;
                text-align: center;
            }

            :host
                ::ng-deep
                .intuitive-paginator
                .p-paginator-jump-to-page
                .p-inputtext:hover {
                border-color: #94a3b8;
            }

            :host
                ::ng-deep
                .intuitive-paginator
                .p-paginator-jump-to-page
                .p-inputtext:focus {
                border-color: #6366f1;
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            }

            .loading-indicator {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(
                    90deg,
                    transparent,
                    #6366f1,
                    transparent
                );
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .loading-indicator.active {
                opacity: 1;
                animation: loading 1.5s infinite;
            }

            @keyframes loading {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%);
                }
            }

            @media (max-width: 768px) {
                .pagination-wrapper {
                    padding: 0.75rem;
                }

                :host ::ng-deep .intuitive-paginator {
                    padding: 0.75rem;
                    flex-direction: column;
                    gap: 0.75rem;
                    width: 100%;
                    max-width: 400px;
                }

                :host ::ng-deep .intuitive-paginator .p-paginator-current {
                    order: 1;
                    min-width: 100%;
                    margin-bottom: 0.5rem;
                }

                :host ::ng-deep .intuitive-paginator .p-paginator-pages {
                    order: 2;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                :host ::ng-deep .intuitive-paginator .p-paginator-first,
                :host ::ng-deep .intuitive-paginator .p-paginator-prev,
                :host ::ng-deep .intuitive-paginator .p-paginator-next,
                :host ::ng-deep .intuitive-paginator .p-paginator-last {
                    order: 3;
                }

                :host ::ng-deep .intuitive-paginator .p-paginator-rpp-options {
                    order: 4;
                    width: 100%;
                    text-align: center;
                    margin-top: 0.5rem;
                }

                :host ::ng-deep .intuitive-paginator .p-paginator-jump-to-page {
                    order: 5;
                    width: 100%;
                    text-align: center;
                    margin-top: 0.5rem;
                }
            }

            /* Mode sombre optionnel */
            /* @media (prefers-color-scheme: dark) {
            :host ::ng-deep .intuitive-paginator {
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                border-color: #334155;
                box-shadow: 
                    0 2px 8px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05);
            }

            :host ::ng-deep .intuitive-paginator:hover {
                border-color: #475569;
                box-shadow: 
                    0 4px 16px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-current {
                background: rgba(99, 102, 241, 0.15);
                color: #cbd5e1;
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-page {
                background: #1e293b;
                border-color: #334155;
                color: #cbd5e1;
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-page:hover {
                background: #334155;
                border-color: #475569;
            }

            :host ::ng-deep .intuitive-paginator .p-paginator-page.p-highlight {
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            }
        }*/
        `,
    ],
    imports: [CommonModule, PaginatorModule, TranslateModule, SeparatorThousandsPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
    private readonly translateService = inject(TranslateService);
    public readonly pagination = input.required<Paginate<any> | null>();

    @Output() pageChange = new EventEmitter<number>();
    @Output() rowsPerPageChange = new EventEmitter<number>();

    @Input() defaultRows = 10;
    @Input() rowsPerPageOptions = [10, 20, 50, 100];
    public readonly showJumpToPage = input<boolean>(false);
    public readonly pageLinkSize = input<number>(5);
    public readonly showCurrentPageReport = input<boolean>(true);

    readonly totalRecords = computed(() => this.pagination()?.total || 0);
    readonly rowsPerPage = computed(() => this.pagination()?.per_page || this.defaultRows);
    readonly currentPage = computed(() => this.pagination()?.current_page || 1);

    readonly firstRecordIndex = computed(() => {
        if (!this.pagination()?.current_page) return 0;
        return (this.pagination()!.current_page - 1) * this.rowsPerPage();
    });

    currentPageReportTemplate = signal<string>('');

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
