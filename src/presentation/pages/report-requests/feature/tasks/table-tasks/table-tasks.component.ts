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
import { TASKS_TABLE_CONST } from '@presentation/pages/report-requests/domain/constants/tasks/tasks-table.constants';
import { TasksEntity } from '@presentation/pages/report-requests/domain/entities/tasks/tasks.entity';
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'app-table-tasks',
    standalone: true,
    templateUrl: './table-tasks.component.html',
    styleUrls: ['./table-tasks.component.scss'],
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
export class TableTasksComponent implements OnDestroy {
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

    @Output() treatmentRequested = new EventEmitter<TasksEntity>();
    @Output() refreshRequested = new EventEmitter<void>();

    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    readonly tableConfig: TableConfig = TASKS_TABLE_CONST;

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onRefresh(): void {
        this.refreshRequested.emit();
    }

    public onExportExcel(): void {
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

    public copyToClipboard(data: string): void {
        this.clipboardService.copyFromContent(data);
        this.toastService.success(
            this.translate.instant('COPIED_TO_THE_CLIPBOARD')
        );
    }

    public onActionClicked(item: TasksEntity): void {
        this.treatmentRequested.emit(item);
    }

    private _subscribeToData(): void {
        this._tasks$
            .pipe(
                takeUntil(this.destroy$),
                tap((data) => {
                    const items = data ?? [];
                    this.tasks.set(items);
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
            orange: 'REPORTS_REQUESTS.TASKS.OPTIONS.OPERATOR.ORANGE',
            mtn: 'REPORTS_REQUESTS.TASKS.OPTIONS.OPERATOR.MTN',
            moov: 'REPORTS_REQUESTS.TASKS.OPTIONS.OPERATOR.MOOV',
        };
        const key = translationMap[normalized];
        return key ? this.translate.instant(key) : operator;
    }

    public getTaskTooltip(item: TasksEntity): string {
        const tasksLabel = this.translate.instant(
            'REPORTS_REQUESTS.TASKS.TABLE.QUALIFY'
        );
        return `${tasksLabel} ${item.uniqId}`;
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
