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
import { AllTableMapper } from '@presentation/pages/report-requests/data/mappers/all-table.mapper';
import { ALL_TABLE_CONST } from '@presentation/pages/report-requests/domain/constants/all/all-table.constants';
import {
    AllEntity,
    ReportStatus,
} from '@presentation/pages/report-requests/domain/entities/all/all.entity';
import { AllTableVM } from '@presentation/pages/report-requests/domain/view-models/all-table.vm';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
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
    private readonly allTableMapper = inject(AllTableMapper);
    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly destroy$ = new Subject<void>();

    readonly all = signal<AllTableVM[]>([]);
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

    private _all$!: Observable<AllEntity[]>;

    @Output() treatmentRequested = new EventEmitter<AllEntity>();
    @Output() journalRequested = new EventEmitter<AllEntity>();
    @Output() refreshRequested = new EventEmitter<void>();

    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    readonly tableConfig: TableConfig = ALL_TABLE_CONST;

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onRefresh(): void {
        this.refreshRequested.emit();
    }

    public onExportExcel(): void {
        const all = this.all();
        if (all && all.length > 0) {
            const fileName = `${this.exportFilePrefix}-all`;
            this.tableExportExcelFileService.exportAsExcelFile(
                all,
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

    public onActionClicked(item: AllEntity): void {
        this.treatmentRequested.emit(item);
    }

    private _subscribeToData(): void {
        this._all$
            .pipe(
                takeUntil(this.destroy$),
                tap((data) => {
                    const items = data ?? [];
                    this.all.set(this.allTableMapper.toVMList(items));
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

    getOperatorTagStyle(operator: TelecomOperator): OperatorTagStyle {
        const colorMap: Record<TelecomOperator, OperatorTagSeverity> = {
            [TelecomOperator.ORANGE]: 'rgb(241, 110, 0)',
            [TelecomOperator.MTN]: 'rgb(255, 203, 5)',
            [TelecomOperator.MOOV]: 'rgb(0, 91, 164)',
            [TelecomOperator.UNKNOWN]: 'rgba(var(--theme-default-rgb), 0.8)',
        };
        const backgroundColor: OperatorTagSeverity = colorMap[operator];
        const textColor: operatorTextStyle =
            operator === TelecomOperator.MTN ? '#212121' : '#ffffff';
        return { backgroundColor, color: textColor };
    }

    public getStatusSeverity(status: ReportStatus): StatusTagSeverity {
        const severityMap: Record<ReportStatus, StatusTagSeverity> = {
            [ReportStatus.ABANDONED]: 'warning',
            [ReportStatus.APPROVED]: 'success',
            [ReportStatus.REJECTED]: 'danger',
            [ReportStatus.CONFIRMED]: 'contrast',
            [ReportStatus.UNKNOWN]: 'dark',
        };
        return severityMap[status] ?? 'secondary';
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

type StatusTagSeverity =
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | 'dark';
type OperatorTagSeverity =
    | 'rgb(241, 110, 0)'
    | 'rgb(255, 203, 5)'
    | 'rgb(0, 91, 164)'
    | 'rgba(var(--theme-default-rgb), 0.8)';
type operatorTextStyle = '#212121' | '#ffffff';
type OperatorTagStyle = {
    backgroundColor: OperatorTagSeverity;
    color: operatorTextStyle;
};
