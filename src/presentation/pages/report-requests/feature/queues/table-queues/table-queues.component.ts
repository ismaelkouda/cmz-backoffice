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
import { QueuesEntity } from '@presentation/pages/report-requests/domain/entities/queues/queues.entity';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { QUEUES_TABLE_CONST } from '../../../domain/constants/queues/queues-table.constants';

type TagSeverity =
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast';

@Component({
    selector: 'app-table-queues',
    standalone: true,
    templateUrl: './table-queues.component.html',
    styleUrls: ['./table-queues.component.scss'],
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
export class TableQueuesComponent implements OnDestroy {
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly clipboardService = inject(ClipboardService);
    private readonly destroy$ = new Subject<void>();

    readonly queues = signal<QueuesEntity[]>([]);
    readonly isLoading = signal<boolean>(false);
    readonly hasData = signal<boolean>(false);

    @Input({ required: true })
    set queues$(value: Observable<QueuesEntity[]>) {
        this._queues$ = value;
        this._subscribeToData();
    }

    @Input({ required: true })
    pagination$!: Observable<Paginate<QueuesEntity>>;

    @Input()
    set loading(value: boolean) {
        this.isLoading.set(value);
    }

    @Output() treatmentRequested = new EventEmitter<QueuesEntity>();
    @Output() journalRequested = new EventEmitter<QueuesEntity>();
    @Output() refreshRequested = new EventEmitter<void>();

    private _queues$!: Observable<QueuesEntity[]>;

    readonly tableConfig = QUEUES_TABLE_CONST;

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onRefresh(): void {
        this.refreshRequested.emit();
    }
    public onExportExcel(): void {
        /* this.queues$.pipe(take(1)).subscribe((queues) => {
            if (queues && queues.length > 0) {
                const fileName = `${this.exportFilePrefix}-queues`;
                this.tableExportExcelFileService.exportAsExcelFile(
                    queues,
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

    public onActionClicked(item: QueuesEntity): void {
        this.treatmentRequested.emit(item);
    }

    private _subscribeToData(): void {
        this._queues$
            .pipe(
                takeUntil(this.destroy$),
                tap((data) => {
                    const items = data ?? [];
                    this.queues.set(items);
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

    getStateSeverity(state: string | null | undefined): string {
        if (!state) return 'secondary';
        const severityMap: Record<string, TagSeverity> = {
            pending: 'info',
            abandoned: 'warning',
            approved: 'success',
            rejected: 'danger',
        };
        return severityMap[state.toLowerCase()] ?? 'secondary';
    }

    getStateLabel(state: string | null | undefined): string {
        if (!state) return '-';
        const labelMap: Record<string, string> = {
            pending: 'REPORTS_REQUESTS.QUEUES.OPTIONS.STATUS.PENDING',
            rejected: 'REPORTS_REQUESTS.QUEUES.OPTIONS.STATUS.REJECTED',
            abandoned: 'REPORTS_REQUESTS.QUEUES.OPTIONS.STATUS.ABANDONED',
            approved: 'REPORTS_REQUESTS.QUEUES.OPTIONS.STATUS.APPROVED',
        };
        const key = labelMap[state.toLowerCase()];
        return key ? this.translate.instant(key) : state;
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
            orange: 'REPORTS_REQUESTS.QUEUES.OPTIONS.OPERATOR.ORANGE',
            mtn: 'REPORTS_REQUESTS.QUEUES.OPTIONS.OPERATOR.MTN',
            moov: 'REPORTS_REQUESTS.QUEUES.OPTIONS.OPERATOR.MOOV',
        };
        const key = translationMap[normalized];
        return key ? this.translate.instant(key) : operator;
    }

    getTakeTooltip(item: QueuesEntity): string {
        const canTake = item.canBeTaken();
        if (canTake) {
            const queuesLabel = this.translate.instant(
                'REPORTS_REQUESTS.QUEUES.TABLE.TAKE'
            );
            return `${queuesLabel} ${item.uniqId}`;
        }
        return this.translate.instant('REPORTS_REQUESTS.QUEUES.TABLE.SEE_MORE');
    }

    trackByUniqId(_: number, item: QueuesEntity): string {
        return item.uniqId;
    }

    trackByOperator(_: number, operator: string): string {
        return operator;
    }

    trackByColField(_: number, col: any): string {
        return col.field;
    }

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    private normalizeExportPrefix(appName: string): string {
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }
}
