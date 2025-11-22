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
import { ALL_TABLE_CONST } from '@presentation/pages/finalization/domain/constants/all/all-table.constants';
import { AllEntity } from '@presentation/pages/finalization/domain/entities/all/all.entity';
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
import { Observable, take } from 'rxjs';

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
export class TableAllComponent {
    @Input() spinner!: boolean;
    @Input() listAll$!: Observable<AllEntity[]>;
    @Input() pagination$!: Observable<Paginate<AllEntity>>;
    @Output() treatmentRequested = new EventEmitter<AllEntity>();
    @Output() refreshRequested = new EventEmitter<void>();

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );
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

    private readonly submissionStateLabelMap: Record<string, string> = {
        pending: 'REPORTS_REQUESTS.ALL.LABELS.SUBMISSION_STATE.PENDING',
        acknowledged:
            'REPORTS_REQUESTS.ALL.LABELS.SUBMISSION_STATE.ACKNOWLEDGED',
        validated: 'REPORTS_REQUESTS.ALL.LABELS.SUBMISSION_STATE.VALIDATED',
    };

    private readonly submissionStateSeverityMap: Record<string, TagSeverity> = {
        pending: 'warning',
        acknowledged: 'info',
        validated: 'success',
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

    public readonly table: TableConfig = ALL_TABLE_CONST;

    constructor(
        private readonly toastService: ToastrService,
        private readonly clipboardService: ClipboardService,
        private readonly tableExportExcelFileService: TableExportExcelFileService,
        private readonly translate: TranslateService
    ) {}

    public onExportExcel(): void {
        this.listAll$.pipe(take(1)).subscribe((all) => {
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
        });
    }

    public onRefresh(): void {
        this.refreshRequested.emit();
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

    public getOperatorTagStyle(operator: string): Record<string, string> {
        const normalized = operator?.toLowerCase().trim() ?? '';
        const backgroundColor = this.getOperatorColor(operator);
        const textColor = normalized === 'mtn' ? '#212121' : '#ffffff';

        return {
            backgroundColor,
            color: textColor,
        };
    }

    public getOperatorLabel(operator: string): string {
        const normalized = operator?.toLowerCase().trim() ?? '';
        let translationKey = '';

        switch (normalized) {
            case 'orange':
                translationKey = 'REPORTS_REQUESTS.ALL.OPTIONS.OPERATOR.ORANGE';
                break;
            case 'mtn':
                translationKey = 'REPORTS_REQUESTS.ALL.OPTIONS.OPERATOR.MTN';
                break;
            case 'moov':
                translationKey = 'REPORTS_REQUESTS.ALL.OPTIONS.OPERATOR.MOOV';
                break;
            default:
                return operator;
        }

        return this.translate.instant(translationKey);
    }

    public getReportTypeLabel(reportType: string): string {
        const normalized = reportType?.toLowerCase().trim() ?? '';
        let translationKey = '';

        switch (normalized) {
            case 'couverture partielle signal':
                translationKey =
                    'REPORTS_REQUESTS.ALL.OPTIONS.REPORT_TYPE.PARTIAL_SIGNAL';
                break;
            case 'zone blanche':
                translationKey =
                    'REPORTS_REQUESTS.ALL.OPTIONS.REPORT_TYPE.WHITE_ZONE';
                break;
            case "absence d'internet":
                translationKey =
                    'REPORTS_REQUESTS.ALL.OPTIONS.REPORT_TYPE.NO_INTERNET';
                break;
            default:
                return reportType;
        }

        return this.translate.instant(translationKey);
    }

    public onActionClicked(item: AllEntity): void {
        this.treatmentRequested.emit(item);
    }

    public getAllTooltip(uniqId: string): string {
        const allLabel = this.translate.instant(
            'REPORTS_REQUESTS.ALL.TABLE.QUALIFY'
        );
        return `${allLabel} ${uniqId}`;
    }

    public getStatusSeverity(status: string): TagSeverity {
        const normalized = status?.toLowerCase() ?? '';
        return this.statusSeverityMap[normalized] ?? 'secondary';
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

    public getStateSeverity(state: string | null | undefined): TagSeverity {
        const normalized = state?.toLowerCase() ?? '';
        return this.stateSeverityMap[normalized] ?? 'secondary';
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
