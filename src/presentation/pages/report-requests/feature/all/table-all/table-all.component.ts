import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    inject,
    signal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ALL_TABLE_CONST } from '@presentation/pages/report-requests/domain/constants/all/all-table.constants';
import { AllEntity } from '@presentation/pages/report-requests/domain/entities/all/all.entity';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/interfaces/paginate';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import {
    TableConfig,
    TableExportExcelFileService,
} from '@shared/services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'app-table-all',
    standalone: true,
    templateUrl: './table-all.component.html',
    styleUrls: ['./table-all.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        AsyncPipe,
        TableModule,
        TranslateModule,
        ButtonModule,
        TooltipModule,
        ProgressSpinnerModule,
        TagModule,
        TableButtonHeaderComponent,
        SearchTableComponent,
        TableTitleComponent,
    ],
})
export class TableAllComponent implements OnDestroy {
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly clipboardService = inject(ClipboardService);
    private readonly destroy$ = new Subject<void>();

    readonly all = signal<AllEntity[]>([]);
    readonly isLoading = signal<boolean>(false);
    readonly hasData = signal<boolean>(false);

    @Input({ required: true })
    set all$(value: Observable<AllEntity[]>) {
        this._all$ = value;
        this._subscribeToData();
    }

    @Input({ required: true })
    pagination$!: Observable<Paginate<AllEntity>>;

    @Input()
    set loading(value: boolean) {
        this.isLoading.set(value);
    }

    @Output() treatmentRequested = new EventEmitter<AllEntity>();
    @Output() journalRequested = new EventEmitter<AllEntity>();
    @Output() refreshRequested = new EventEmitter<void>();

    private _all$!: Observable<AllEntity[]>;

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    readonly tableConfig: TableConfig = ALL_TABLE_CONST;

    private readonly translationCache = new Map<string, string>();

    private readonly statusLabelMap: Record<string, string> = {
        submission: 'REPORTS_REQUESTS.ALL.LABELS.STATUS.SUBMISSION',
        processing: 'REPORTS_REQUESTS.ALL.LABELS.STATUS.PROCESSING',
        closure: 'REPORTS_REQUESTS.ALL.LABELS.STATUS.CLOSURE',
    };

    private readonly statusSeverityMap: Record<string, TagSeverity> = {
        submission: 'info',
        processing: 'warning',
        closure: 'success',
    };

    private readonly processingStateLabelMap: Record<string, string> = {
        received: 'REPORTS_REQUESTS.ALL.LABELS.PROCESSING_STATE.RECEIVED',
        in_progress: 'REPORTS_REQUESTS.ALL.LABELS.PROCESSING_STATE.IN_PROGRESS',
        completed: 'REPORTS_REQUESTS.ALL.LABELS.PROCESSING_STATE.COMPLETED',
    };

    private readonly processingStateSeverityMap: Record<string, TagSeverity> = {
        received: 'info',
        in_progress: 'warning',
        completed: 'success',
    };

    private readonly stateLabelMap: Record<string, string> = {
        alld: 'REPORTS_REQUESTS.ALL.OPTIONS.STATE.APPROVED',
        received: 'REPORTS_REQUESTS.ALL.OPTIONS.STATE.RECEIVED',
        rejected: 'REPORTS_REQUESTS.ALL.OPTIONS.STATE.REJECTED',
    };

    private readonly stateSeverityMap: Record<string, TagSeverity> = {
        alld: 'success',
        received: 'info',
        rejected: 'danger',
    };

    constructor(
        private readonly tableExportExcelFileService: TableExportExcelFileService
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onRefresh(): void {
        this.refreshRequested.emit();
    }

    public onExportExcel(): void {
        /* this.all$.pipe(take(1)).subscribe((all) => {
            if (all && all.length > 0) {
                const fileName = `${this.exportFilePrefix}-all`;
                this.tableExportExcelFileService.exportAsExcelFile(
                    all,
                    this.table,
                    fileName
                );
            } else {
                this.toastService.error(
                    this.translate.instant('EXPORT.NO_DATA')
                );
            }
        }); */
    }

    public copyToClipboard(data: string): void {
        this.clipboardService.copyFromContent(data);
        this.toastService.success(
            this.translate.instant('COPIED_TO_THE_CLIPBOARD')
        );
    }

    public onActionClicked(item: AllEntity): void {
        this.treatmentRequested.emit(item);
    }

    private _subscribeToData(): void {
        this._all$
            .pipe(
                takeUntil(this.destroy$),
                tap((data) => {
                    const items = data ?? [];
                    this.all.set(items);
                    this.hasData.set(items.length > 0);
                })
            )
            .subscribe();
    }

    formatDate(value: string): string {
        if (!value) return '-';
        try {
            const normalized = value.includes('T')
                ? value
                : value.replace(' ', 'T');
            const withTimezone = normalized.endsWith('Z')
                ? normalized
                : `${normalized}Z`;
            const date = new Date(withTimezone);
            return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
        } catch {
            return value;
        }
    }
    public getAllTooltip(uniqId: string): string {
        const allLabel = this.translate.instant(
            'REPORTS_REQUESTS.ALL.TABLE.SEE_MORE'
        );
        return `${allLabel} ${uniqId}`;
    }

    getOperatorColor(operator: string): string {
        const normalized = operator?.toLowerCase().trim() ?? '';
        const colorMap: Record<string, string> = {
            orange: 'rgb(241, 110, 0)',
            mtn: 'rgb(255, 203, 5)',
            moov: 'rgb(0, 91, 164)',
        };
        return colorMap[normalized] ?? `rgba(var(--theme-default-rgb), 0.8)`;
    }

    getOperatorTagStyle(operator: string): Record<string, string> {
        const backgroundColor = this.getOperatorColor(operator);
        const textColor =
            operator?.toLowerCase() === 'mtn' ? '#212121' : '#ffffff';
        return { backgroundColor, color: textColor };
    }

    getOperatorLabel(operator: string): string {
        const normalized = operator?.toLowerCase().trim() ?? '';
        const translationMap: Record<string, string> = {
            orange: 'REPORTS_REQUESTS.ALL.OPTIONS.OPERATOR.ORANGE',
            mtn: 'REPORTS_REQUESTS.ALL.OPTIONS.OPERATOR.MTN',
            moov: 'REPORTS_REQUESTS.ALL.OPTIONS.OPERATOR.MOOV',
        };
        const key = translationMap[normalized];
        return key ? this.translate.instant(key) : operator;
    }

    public getStatusSeverity(status: string): TagSeverity {
        const normalized = status?.toLowerCase() ?? '';
        return this.statusSeverityMap[normalized] ?? 'secondary';
    }

    public getStatusLabel(state: string | null | undefined): string | null {
        if (!state) {
            return null;
        }
        const normalized = state.toLowerCase();
        const key = this.stateLabelMap[normalized];
        if (!key) {
            return state;
        }
        return this.translateLabel(key, state);
    }

    public getStateSeverity(state: string | null | undefined): TagSeverity {
        const normalized = state?.toLowerCase() ?? '';
        return this.stateSeverityMap[normalized] ?? 'secondary';
    }

    private translateLabel(key: string, fallback: string): string {
        if (this.translationCache.has(key)) {
            return this.translationCache.get(key) as string;
        }

        const translated = this.translate.instant(key);
        const normalized = translated === key ? fallback : translated;
        this.translationCache.set(key, normalized);
        return normalized;
    }

    trackByUniqId(_: number, item: AllEntity): string {
        return item.uniqId;
    }

    trackByOperator(_: number, operator: string): string {
        return operator;
    }

    trackByColField(_: number, col: any): string {
        return col.field;
    }

    private normalizeExportPrefix(appName: string): string {
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }
}

type TagSeverity =
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast';
