import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    inject,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { QUEUES_TABLE_CONST } from '@presentation/pages/finalization/domain/constants/queues-table.constant';
import { QueuesEntity } from '@presentation/pages/finalization/domain/entities/queues/queues.entity';
import { TableSelectionService } from '@presentation/pages/finalization/domain/services/table-selection.service';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'app-table-queues',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TableModule,
        ButtonModule,
        InputNumberModule,
        CheckboxModule,
        TagModule,
        TooltipModule,
        ProgressSpinnerModule,
        SearchTableComponent,
        TableButtonHeaderComponent,
        TableTitleComponent,
        TagModule,
    ],
    templateUrl: './table-queues.component.html',
    styleUrls: ['./table-queues.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TableSelectionService],
})
export class TableQueuesComponent implements OnInit, OnDestroy {
    private readonly selectionService = inject(
        TableSelectionService<QueuesEntity>
    );
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly clipboardService = inject(ClipboardService);
    private readonly destroy$ = new Subject<void>();

    readonly queues = signal<QueuesEntity[]>([]);
    readonly selectionInputValue = signal<number | null>(null);
    readonly isLoading = signal<boolean>(false);
    readonly hasData = signal<boolean>(false);

    get selectedCount() {
        return this.selectionService.selectedCount();
    }
    get hasSelection() {
        return this.selectionService.hasSelection();
    }

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
    @Output() selectionChanged = this.selectionService.selectionChange$;

    private _queues$!: Observable<QueuesEntity[]>;

    readonly tableConfig = QUEUES_TABLE_CONST;

    ngOnInit(): void {
        this._setupSelectionMonitoring();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleRowClick(event: MouseEvent, queue: QueuesEntity): void {
        const target = event.target as HTMLElement;
        if (this._isInteractiveElement(target)) {
            return;
        }
        if (this.isLoading()) {
            return;
        }
        this.handleItemSelection(queue);
    }

    private _isInteractiveElement(element: HTMLElement): boolean {
        const interactiveSelectors = [
            'button',
            'a',
            'input',
            'select',
            'textarea',
            '[role="button"]',
            '.p-checkbox',
            '.action-btn',
            '.copy-button',
        ];

        return interactiveSelectors.some((selector) => {
            return element.closest(selector) !== null;
        });
    }

    handleSelectCount(value: number | null): void {
        if (!value || value <= 0) {
            this.selectionService.clearSelection('input');
        } else {
            this.selectionService.selectFirstNItems(value, 'input');
        }
    }

    handleItemSelection(item: QueuesEntity): void {
        this.selectionService.toggleItemSelection(item, 'checkbox');
    }

    isItemSelected(item: QueuesEntity): boolean {
        return this.selectionService.isItemSelected(item);
    }

    clearSelection(): void {
        this.selectionService.clearSelection('clear');
        this.selectionInputValue.set(null);
    }

    onExportExcel(): void {
        const items = this.queues();
        if (!items?.length) {
            this.toastService.error(this.translate.instant('EXPORT.NO_DATA'));
            return;
        }
    }

    onRefresh(): void {
        this.clearSelection();
        this.refreshRequested.emit();
    }

    copyToClipboard(value: string): void {
        this.clipboardService.copyFromContent(value);
        this.toastService.success(
            this.translate.instant('COPIED_TO_THE_CLIPBOARD')
        );
    }

    onActionClicked(item: QueuesEntity): void {
        this.treatmentRequested.emit(item);
    }

    onJournalClicked(item: QueuesEntity): void {
        this.journalRequested.emit(item);
    }

    private _subscribeToData(): void {
        this._queues$
            .pipe(
                takeUntil(this.destroy$),
                tap((data) => {
                    const items = data ?? [];
                    this.queues.set(items);
                    this.hasData.set(items.length > 0);
                    this.selectionService.setAvailableItems(items);
                })
            )
            .subscribe();
    }

    private _setupSelectionMonitoring(): void {
        this.selectionService.selectionChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((event) => {
                const newInputValue =
                    event.selectionCount > 0 ? event.selectionCount : null;
                this.selectionInputValue.set(newInputValue);
            });
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
            return isNaN(date.getTime()) ? value : date.toLocaleString();
        } catch {
            return value;
        }
    }

    getStateSeverity(state: string | null | undefined): string {
        if (!state) return 'secondary';
        const severityMap: Record<string, string> = {
            accepted: 'success',
            pending: 'warning',
            rejected: 'danger',
        };
        return severityMap[state.toLowerCase()] ?? 'secondary';
    }

    getStateLabel(state: string | null | undefined): string {
        if (!state) return '-';
        const labelMap: Record<string, string> = {
            accepted: 'FINALIZATION.QUEUES.OPTIONS.STATE.ACCEPTED',
            pending: 'FINALIZATION.QUEUES.OPTIONS.STATUS.PENDING',
            rejected: 'FINALIZATION.QUEUES.OPTIONS.STATE.REJECTED',
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
            orange: 'FINALIZATION.QUEUES.OPTIONS.OPERATOR.ORANGE',
            mtn: 'FINALIZATION.QUEUES.OPTIONS.OPERATOR.MTN',
            moov: 'FINALIZATION.QUEUES.OPTIONS.OPERATOR.MOOV',
        };
        const key = translationMap[normalized];
        return key ? this.translate.instant(key) : operator;
    }

    getReportTypeLabel(reportType: string): string {
        const normalized = reportType?.toLowerCase().trim() ?? '';
        const translationMap: Record<string, string> = {
            'couverture partielle signal':
                'FINALIZATION.QUEUES.OPTIONS.REPORT_TYPE.PARTIAL_SIGNAL',
            'zone blanche':
                'FINALIZATION.QUEUES.OPTIONS.REPORT_TYPE.WHITE_ZONE',
            "absence d'internet":
                'FINALIZATION.QUEUES.OPTIONS.REPORT_TYPE.NO_INTERNET',
        };
        const key = translationMap[normalized];
        return key ? this.translate.instant(key) : reportType;
    }

    getTakeTooltip(item: QueuesEntity): string {
        const normalizedState = item.state?.toLowerCase() ?? '';
        if (normalizedState === 'pending') {
            const queuesLabel = this.translate.instant(
                'FINALIZATION.QUEUES.TABLE.TAKE'
            );
            return `${queuesLabel} ${item.uniqId}`;
        }
        return this.translate.instant('FINALIZATION.QUEUES.TABLE.SEE_MORE');
    }

    getJournalTooltip(item: QueuesEntity): string {
        const queuesLabel = this.translate.instant(
            'FINALIZATION.QUEUES.TABLE.JOURNAL'
        );
        return `${queuesLabel} ${item.uniqId}`;
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
}
