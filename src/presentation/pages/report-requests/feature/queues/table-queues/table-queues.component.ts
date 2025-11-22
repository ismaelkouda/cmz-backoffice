import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    inject,
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
import { Observable, take } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
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
export class TableQueuesComponent {
    @Input() isLoading!: boolean;
    @Input() listQueues$!: Observable<QueuesEntity[]>;
    @Input() pagination$!: Observable<Paginate<QueuesEntity>>;
    @Output() treatmentRequested = new EventEmitter<QueuesEntity>();
    @Output() refreshRequested = new EventEmitter<void>();

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );
    private readonly translationCache = new Map<string, string>();

    private readonly statusLabelMap: Record<string, string> = {
        pending: 'REPORTS_REQUESTS.QUEUES.OPTIONS.STATUS.PENDING',
        rejected: 'REPORTS_REQUESTS.QUEUES.OPTIONS.STATUS.REJECTED',
        abandoned: 'REPORTS_REQUESTS.QUEUES.OPTIONS.STATUS.ABANDONED',
        approved: 'REPORTS_REQUESTS.QUEUES.OPTIONS.STATUS.APPROVED',
    };

    private readonly statusSeverityMap: Record<string, TagSeverity> = {
        pending: 'info',
        abandoned: 'warning',
        approved: 'success',
        rejected: 'danger',
    };

    private readonly submissionStateLabelMap: Record<string, string> = {
        pending: 'REPORTS_REQUESTS.QUEUES.LABELS.SUBMISSION_STATE.PENDING',
        acknowledged:
            'REPORTS_REQUESTS.QUEUES.LABELS.SUBMISSION_STATE.ACKNOWLEDGED',
        validated: 'REPORTS_REQUESTS.QUEUES.LABELS.SUBMISSION_STATE.VALIDATED',
    };

    private readonly submissionStateSeverityMap: Record<string, TagSeverity> = {
        pending: 'warning',
        acknowledged: 'info',
        validated: 'success',
    };

    private readonly processingStateLabelMap: Record<string, string> = {
        received: 'REPORTS_REQUESTS.QUEUES.LABELS.PROCESSING_STATE.RECEIVED',
        in_progress:
            'REPORTS_REQUESTS.QUEUES.LABELS.PROCESSING_STATE.IN_PROGRESS',
        completed: 'REPORTS_REQUESTS.QUEUES.LABELS.PROCESSING_STATE.COMPLETED',
    };

    private readonly processingStateSeverityMap: Record<string, TagSeverity> = {
        received: 'info',
        in_progress: 'warning',
        completed: 'success',
    };

    private readonly stateSeverityMap: Record<string, TagSeverity> = {
        pending: 'warning',
        rejected: 'danger',
    };

    public readonly table: TableConfig = QUEUES_TABLE_CONST;

    constructor(
        private readonly toastService: ToastrService,
        private readonly clipboardService: ClipboardService,
        private readonly tableExportExcelFileService: TableExportExcelFileService,
        private readonly translate: TranslateService
    ) {}

    public onRefreshRequested(): void {
        this.refreshRequested.emit();
    }

    public onExportExcel(): void {
        this.listQueues$.pipe(take(1)).subscribe((queues) => {
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
        });
    }

    public copyToClipboard(data: string): void {
        this.clipboardService.copyFromContent(data);
        this.toastService.success(
            this.translate.instant('COPIED_TO_THE_CLIPBOARD')
        );
    }

    public formatDate(value: string): string {
        if (!value) {
            return '-';
        }

        const normalized = value.replace(' ', 'T');
        const withTimezone =
            /z$/i.test(normalized) || normalized.endsWith('Z')
                ? normalized
                : `${normalized}Z`;
        const parsed = new Date(withTimezone);

        if (Number.isNaN(parsed.getTime())) {
            return value;
        }

        return parsed.toLocaleString();
    }

    public getReportTypeLabel(reportType: string): string {
        const normalized = reportType?.toLowerCase().trim() ?? '';
        let translationKey = '';

        switch (normalized) {
            case 'couverture partielle signal':
                translationKey =
                    'REPORTS_REQUESTS.QUEUES.OPTIONS.REPORT_TYPE.PARTIAL_SIGNAL';
                break;
            case 'zone blanche':
                translationKey =
                    'REPORTS_REQUESTS.QUEUES.OPTIONS.REPORT_TYPE.WHITE_ZONE';
                break;
            case "absence d'internet":
                translationKey =
                    'REPORTS_REQUESTS.QUEUES.OPTIONS.REPORT_TYPE.NO_INTERNET';
                break;
            default:
                return reportType;
        }

        return this.translate.instant(translationKey);
    }

    public getOperatorLabel(operator: string): string {
        const normalized = operator?.toLowerCase().trim() ?? '';
        let translationKey = '';

        switch (normalized) {
            case 'orange':
                translationKey =
                    'REPORTS_REQUESTS.QUEUES.OPTIONS.OPERATOR.ORANGE';
                break;
            case 'mtn':
                translationKey = 'REPORTS_REQUESTS.QUEUES.OPTIONS.OPERATOR.MTN';
                break;
            case 'moov':
                translationKey =
                    'REPORTS_REQUESTS.QUEUES.OPTIONS.OPERATOR.MOOV';
                break;
            default:
                return operator;
        }

        return this.translate.instant(translationKey);
    }

    public getOperatorTagStyle(operator: string): Record<string, string> {
        const normalized = operator?.toLowerCase().trim() ?? '';
        const backgroundColor = this.getOperatorColor(operator);
        const textColor = normalized === 'mtn' ? '#212121' : '#ffffff';

        return {
            backgroundColor,
            color: textColor,
        };
    }

    public getOperatorColor(operator: string): string {
        const normalized = operator?.toLowerCase().trim() ?? '';
        switch (normalized) {
            case 'orange':
                return 'rgb(241, 110, 0)';
            case 'mtn':
                return 'rgb(255, 203, 5)';
            case 'moov':
                return 'rgb(0, 91, 164)';
            default:
                return `rgba(var(--theme-default-rgb), 0.8)`;
        }
    }

    public onActionClicked(item: QueuesEntity): void {
        this.treatmentRequested.emit(item);
    }

    public getTakeTooltip(item: QueuesEntity): string | void {
        const canTakeReport = item.canBeTaken();
        let takeLabel: string;
        if (!canTakeReport) {
            takeLabel = this.translate.instant(
                'REPORTS_REQUESTS.QUEUES.TABLE.SEE_MORE'
            );
        }
        takeLabel = this.translate.instant(
            'REPORTS_REQUESTS.QUEUES.TABLE.TAKE'
        );
        return `${takeLabel} ${item.uniqId}`;
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
