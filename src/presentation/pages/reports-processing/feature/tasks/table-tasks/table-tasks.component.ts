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
import { TASKS_TABLE_CONST } from '@presentation/pages/reports-processing/domain/constants/tasks/tasks-table.constants';
import { TasksEntity } from '@presentation/pages/reports-processing/domain/entities/tasks/tasks.entity';
import { TableSelectionService } from '@presentation/pages/reports-processing/domain/services/table-selection.service';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { TableConfig } from '@shared/interfaces/table-config';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';
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

export type TreatmentRequested = 'treat' | 'action';
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
export class TableTasksComponent implements OnInit, OnDestroy {
    private readonly selectionService = inject(
        TableSelectionService<TasksEntity>
    );
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly clipboardService = inject(ClipboardService);
    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly destroy$ = new Subject<void>();

    readonly tasks = signal<TasksEntity[]>([]);
    readonly isLoading = signal<boolean>(false);
    readonly hasData = signal<boolean>(false);
    readonly selectionInputValue = signal<number | null>(null);

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

    private _tasks$!: Observable<TasksEntity[]>;

    @Output() treatmentRequested = new EventEmitter<{
        item: TasksEntity;
        action: TreatmentRequested;
    }>();
    @Output() refreshRequested = new EventEmitter<void>();
    @Output() selectionChanged = this.selectionService.selectionChange$;

    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    readonly tableConfig: TableConfig = TASKS_TABLE_CONST;

    ngOnInit(): void {
        this._setupSelectionMonitoring();
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
        const tasks = this.tasks();
        if (tasks && tasks.length > 0) {
            const fileName = `${this.exportFilePrefix}-tasks`;
            this.tableExportExcelFileService.exportAsExcelFile(
                tasks,
                this.tableConfig,
                fileName
            );
        } else {
            this.toastService.error(this.translate.instant('EXPORT.NO_DATA'));
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

    onActionClicked(item: TasksEntity, action: TreatmentRequested): void {
        if (action === 'treat') {
            this.treatmentRequested.emit({ item, action });
        } else if (action === 'action') {
            this.treatmentRequested.emit({ item, action });
        }
    }

    getActionTooltip(item: TasksEntity): string {
        const tasksLabel = this.translate.instant(
            'REPORTS_PROCESSING.TASKS.TABLE.PROCESSING_NEWSPAPERS'
        );
        return `${tasksLabel} ${item.uniqId}`;
    }

    getTreatTooltip(item: TasksEntity): string {
        const tasksLabel = this.translate.instant(
            'REPORTS_PROCESSING.TASKS.TABLE.TREAT'
        );
        return `${tasksLabel} ${item.uniqId}`;
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
            return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
        } catch {
            return value;
        }
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
            orange: 'REPORTS_PROCESSING.TASKS.OPTIONS.OPERATOR.ORANGE',
            mtn: 'REPORTS_PROCESSING.TASKS.OPTIONS.OPERATOR.MTN',
            moov: 'REPORTS_PROCESSING.TASKS.OPTIONS.OPERATOR.MOOV',
        };
        const key = translationMap[normalized];
        return key ? this.translate.instant(key) : operator;
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

    private normalizeExportPrefix(appName: string): string {
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }
}
