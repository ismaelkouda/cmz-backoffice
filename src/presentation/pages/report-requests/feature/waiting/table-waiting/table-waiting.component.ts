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
import { WaitingEntity } from '@presentation/pages/report-requests/domain/entities/waiting/waiting.entity';
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
import { WAITING_TABLE_CONST } from '../../../domain/constants/waiting-table.constants';

type TagSeverity =
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast';

@Component({
    selector: 'app-table-waiting',
    standalone: true,
    templateUrl: './table-waiting.component.html',
    styleUrls: ['./table-waiting.component.scss'],
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
export class TableWaitingComponent {
    @Input() isLoading!: boolean;
    @Input() listWaiting$!: Observable<WaitingEntity[]>;
    @Input() pagination$!: Observable<Paginate<WaitingEntity>>;
    @Output() treatmentRequested = new EventEmitter<WaitingEntity>();
    @Output() refreshRequested = new EventEmitter<void>();

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );
    private readonly translationCache = new Map<string, string>();

    private readonly statusLabelMap: Record<string, string> = {
        pending: 'REPORT_REQUESTS.WAITING.OPTIONS.STATUS.PENDING',
        rejected: 'REPORT_REQUESTS.WAITING.OPTIONS.STATUS.REJECTED',
        abandoned: 'REPORT_REQUESTS.WAITING.OPTIONS.STATUS.ABANDONED',
        approved: 'REPORT_REQUESTS.WAITING.OPTIONS.STATUS.APPROVED',
    };

    private readonly statusSeverityMap: Record<string, TagSeverity> = {
        pending: 'info',
        abandoned: 'warning',
        approved: 'success',
        rejected: 'danger',
    };

    private readonly submissionStateLabelMap: Record<string, string> = {
        pending: 'REPORT_REQUESTS.WAITING.LABELS.SUBMISSION_STATE.PENDING',
        acknowledged:
            'REPORT_REQUESTS.WAITING.LABELS.SUBMISSION_STATE.ACKNOWLEDGED',
        validated: 'REPORT_REQUESTS.WAITING.LABELS.SUBMISSION_STATE.VALIDATED',
    };

    private readonly submissionStateSeverityMap: Record<string, TagSeverity> = {
        pending: 'warning',
        acknowledged: 'info',
        validated: 'success',
    };

    private readonly processingStateLabelMap: Record<string, string> = {
        received: 'REPORT_REQUESTS.WAITING.LABELS.PROCESSING_STATE.RECEIVED',
        in_progress:
            'REPORT_REQUESTS.WAITING.LABELS.PROCESSING_STATE.IN_PROGRESS',
        completed: 'REPORT_REQUESTS.WAITING.LABELS.PROCESSING_STATE.COMPLETED',
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

    public readonly table: TableConfig = WAITING_TABLE_CONST;

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
        this.listWaiting$.pipe(take(1)).subscribe((waiting) => {
            if (waiting && waiting.length > 0) {
                const fileName = `${this.exportFilePrefix}-waiting`;
                this.tableExportExcelFileService.exportAsExcelFile(
                    waiting,
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
                    'REPORT_REQUESTS.WAITING.OPTIONS.REPORT_TYPE.PARTIAL_SIGNAL';
                break;
            case 'zone blanche':
                translationKey =
                    'REPORT_REQUESTS.WAITING.OPTIONS.REPORT_TYPE.WHITE_ZONE';
                break;
            case "absence d'internet":
                translationKey =
                    'REPORT_REQUESTS.WAITING.OPTIONS.REPORT_TYPE.NO_INTERNET';
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
                    'REPORT_REQUESTS.WAITING.OPTIONS.OPERATOR.ORANGE';
                break;
            case 'mtn':
                translationKey = 'REPORT_REQUESTS.WAITING.OPTIONS.OPERATOR.MTN';
                break;
            case 'moov':
                translationKey =
                    'REPORT_REQUESTS.WAITING.OPTIONS.OPERATOR.MOOV';
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

    public getStatusLabel(status: string | null | undefined): string | null {
        if (!status) {
            return null;
        }
        const normalized = status.toLowerCase();
        const key = this.statusLabelMap[normalized];
        if (!key) {
            return status;
        }
        return this.translateLabel(key, status);
    }

    public getStatusSeverity(status: string | null | undefined): TagSeverity {
        const normalized = status?.toLowerCase() ?? '';
        return this.statusSeverityMap[normalized] ?? 'secondary';
    }

    public onActionClicked(item: WaitingEntity): void {
        this.treatmentRequested.emit(item);
    }

    public getTakeTooltip(item: WaitingEntity): string | void {
        const canTakeReport = item.canBeTaken();
        let takeLabel: string;
        if (!canTakeReport) {
            takeLabel = this.translate.instant(
                'REPORT_REQUESTS.WAITING.TABLE.SEE_MORE'
            );
        }
        takeLabel = this.translate.instant(
            'REPORT_REQUESTS.WAITING.TABLE.TAKE'
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
