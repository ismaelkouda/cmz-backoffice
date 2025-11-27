import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    inject,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TASKS_TABLE_CONST } from '@presentation/pages/finalization/domain/constants/tasks/tasks-table.constants';
import { TasksEntity } from '@presentation/pages/finalization/domain/entities/tasks/tasks.entity';
import { TableSelectionService } from '@presentation/pages/finalization/domain/services/table-selection.service';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/interfaces/paginate';
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
    selector: 'app-table-tasks',
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
    templateUrl: './table-tasks.component.html',
    styleUrls: ['./table-tasks.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TableSelectionService],
})
export class TableTasksComponent {
    private readonly selectionService = inject(
        TableSelectionService<TasksEntity>
    );
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly clipboardService = inject(ClipboardService);
    private readonly destroy$ = new Subject<void>();

    readonly tasks = signal<TasksEntity[]>([]);
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
    set tasks$(value: Observable<TasksEntity[]>) {
        this._tasks$ = value;
        this._subscribeToData();
    }

    @Input({ required: true })
    pagination$!: Observable<Paginate<TasksEntity>>;

    @Input()
    set loading(value: boolean) {
        this.isLoading.set(value);
    }

    @Output() treatmentRequested = new EventEmitter<TasksEntity>();
    @Output() journalRequested = new EventEmitter<TasksEntity>();
    @Output() refreshRequested = new EventEmitter<void>();
    @Output() selectionChanged = this.selectionService.selectionChange$;

    private _tasks$!: Observable<TasksEntity[]>;

    readonly tableConfig = TASKS_TABLE_CONST;

    private readonly translationCache = new Map<string, string>();

    private readonly statusLabelMap: Record<string, string> = {
        submission: 'FINALIZATION.TASKS.LABELS.STATUS.SUBMISSION',
        processing: 'FINALIZATION.TASKS.LABELS.STATUS.PROCESSING',
        closure: 'FINALIZATION.TASKS.LABELS.STATUS.CLOSURE',
    };

    private readonly statusSeverityMap: Record<string, TagSeverity> = {
        submission: 'info',
        processing: 'warning',
        closure: 'success',
    };

    private readonly submissionStateLabelMap: Record<string, string> = {
        pending: 'FINALIZATION.TASKS.LABELS.SUBMISSION_STATE.PENDING',
        acknowledged: 'FINALIZATION.TASKS.LABELS.SUBMISSION_STATE.ACKNOWLEDGED',
        validated: 'FINALIZATION.TASKS.LABELS.SUBMISSION_STATE.VALIDATED',
    };

    private readonly submissionStateSeverityMap: Record<string, TagSeverity> = {
        pending: 'warning',
        acknowledged: 'info',
        validated: 'success',
    };

    private readonly processingStateLabelMap: Record<string, string> = {
        received: 'FINALIZATION.TASKS.LABELS.PROCESSING_STATE.RECEIVED',
        in_progress: 'FINALIZATION.TASKS.LABELS.PROCESSING_STATE.IN_PROGRESS',
        completed: 'FINALIZATION.TASKS.LABELS.PROCESSING_STATE.COMPLETED',
    };

    private readonly processingStateSeverityMap: Record<string, TagSeverity> = {
        received: 'info',
        in_progress: 'warning',
        completed: 'success',
    };

    private readonly stateLabelMap: Record<string, string> = {
        waiting: 'FINALIZATION.TASKS.OPTIONS.STATE.APPROVED',
        received: 'FINALIZATION.TASKS.OPTIONS.STATE.RECEIVED',
        rejected: 'FINALIZATION.TASKS.OPTIONS.STATE.REJECTED',
    };

    private readonly stateSeverityMap: Record<string, TagSeverity> = {
        waiting: 'success',
        received: 'info',
        rejected: 'danger',
    };

    ngOnInit(): void {
        this._setupSelectionMonitoring();
        console.log('TableTasksComponent initialisé');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleRowClick(event: MouseEvent, task: TasksEntity): void {
        const target = event.target as HTMLElement;
        if (this._isInteractiveElement(target)) {
            return;
        }
        if (this.isLoading()) {
            return;
        }
        this.handleItemSelection(task);
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

    handleItemSelection(item: TasksEntity): void {
        console.log('Checkbox changée pour:', item.uniqId);
        this.selectionService.toggleItemSelection(item, 'checkbox');
    }

    isItemSelected(item: TasksEntity): boolean {
        return this.selectionService.isItemSelected(item);
    }

    clearSelection(): void {
        this.selectionService.clearSelection('clear');
        this.selectionInputValue.set(null);
    }

    onExportExcel(): void {
        const items = this.tasks();
        if (!items?.length) {
            this.toastService.error(this.translate.instant('EXPORT.NO_DATA'));
            return;
        }
    }

    onRefresh(): void {
        this.clearSelection();
        this.refreshRequested.emit();
    }

    public copyToClipboard(data: string): void {
        this.clipboardService.copyFromContent(data);
        this.toastService.success(
            this.translate.instant('COPIED_TO_THE_CLIPBOARD')
        );
    }

    onActionClicked(item: TasksEntity): void {
        this.treatmentRequested.emit(item);
    }

    onJournalClicked(item: TasksEntity): void {
        this.journalRequested.emit(item);
    }

    private _subscribeToData(): void {
        this._tasks$
            .pipe(
                takeUntil(this.destroy$),
                tap((data) => {
                    const items = data ?? [];
                    this.tasks.set(items);
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
                console.log(
                    `Synchronisation: input=${newInputValue}, sélection=${event.selectionCount}`
                );
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
            accepted: 'FINALIZATION.TASKS.OPTIONS.STATE.ACCEPTED',
            pending: 'FINALIZATION.TASKS.OPTIONS.STATE.PENDING',
            rejected: 'FINALIZATION.TASKS.OPTIONS.STATE.REJECTED',
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
            orange: 'FINALIZATION.TASKS.OPTIONS.OPERATOR.ORANGE',
            mtn: 'FINALIZATION.TASKS.OPTIONS.OPERATOR.MTN',
            moov: 'FINALIZATION.TASKS.OPTIONS.OPERATOR.MOOV',
        };
        const key = translationMap[normalized];
        return key ? this.translate.instant(key) : operator;
    }

    getReportTypeLabel(reportType: string): string {
        const normalized = reportType?.toLowerCase().trim() ?? '';
        const translationMap: Record<string, string> = {
            'couverture partielle signal':
                'FINALIZATION.TASKS.OPTIONS.REPORT_TYPE.PARTIAL_SIGNAL',
            'zone blanche': 'FINALIZATION.TASKS.OPTIONS.REPORT_TYPE.WHITE_ZONE',
            "absence d'internet":
                'FINALIZATION.TASKS.OPTIONS.REPORT_TYPE.NO_INTERNET',
        };
        const key = translationMap[normalized];
        return key ? this.translate.instant(key) : reportType;
    }

    getTreatTooltip(item: TasksEntity): string {
        const tasksLabel = this.translate.instant(
            'FINALIZATION.TASKS.TABLE.TREAT'
        );
        return `${tasksLabel} ${item.uniqId}`;
    }

    getJournalTooltip(item: TasksEntity): string {
        const queuesLabel = this.translate.instant(
            'FINALIZATION.QUEUES.TABLE.JOURNAL'
        );
        return `${queuesLabel} ${item.uniqId}`;
    }

    public getStatusSeverity(status: string): TagSeverity {
        const normalized = status?.toLowerCase() ?? '';
        return this.statusSeverityMap[normalized] ?? 'secondary';
    }

    trackByUniqId(_: number, item: TasksEntity): string {
        return item.uniqId;
    }

    trackByOperator(_: number, operator: string): string {
        return operator;
    }

    trackByColField(_: number, col: any): string {
        return col.field;
    }

    public getSubmissionStateLabel(
        submissionState: string | null | undefined
    ): string | null {
        if (!submissionState) {
            return null;
        }
        const normalized = submissionState.toLowerCase();
        const key = this.submissionStateLabelMap[normalized];
        if (!key) {
            return submissionState;
        }
        return this.translateLabel(key, submissionState);
    }

    public getSubmissionStateSeverity(
        submissionState: string | null | undefined
    ): TagSeverity {
        const normalized = submissionState?.toLowerCase() ?? '';
        return this.submissionStateSeverityMap[normalized] ?? 'secondary';
    }

    public getProcessingStateLabel(
        processingState: string | null | undefined
    ): string | null {
        if (!processingState) {
            return null;
        }
        const normalized = processingState.toLowerCase();
        const key = this.processingStateLabelMap[normalized];
        if (!key) {
            return processingState;
        }
        return this.translateLabel(key, processingState);
    }

    public getProcessingStateSeverity(
        processingState: string | null | undefined
    ): TagSeverity {
        const normalized = processingState?.toLowerCase() ?? '';
        return this.processingStateSeverityMap[normalized] ?? 'secondary';
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

    private normalizeExportPrefix(appName: string): string {
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
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
}

type TagSeverity =
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast';
