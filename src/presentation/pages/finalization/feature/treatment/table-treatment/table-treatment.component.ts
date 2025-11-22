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
import { TREATMENT_TABLE_CONST } from '@presentation/pages/reports-processing/domain/constants/treatment-table.constant';
import { TreatmentEntity } from '@presentation/pages/reports-processing/domain/entities/treatment/treatment.entity';
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
    selector: 'app-table-treatment',
    standalone: true,
    templateUrl: './table-treatment.component.html',
    styleUrls: ['./table-treatment.component.scss'],
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
export class TableTreatmentComponent {
    @Input() spinner!: boolean;
    @Input() listTreatment$!: Observable<TreatmentEntity[]>;
    @Input() pagination$!: Observable<Paginate<TreatmentEntity>>;
    @Output() treatmentRequested = new EventEmitter<TreatmentEntity>();
    @Output() journalRequested = new EventEmitter<TreatmentEntity>();
    @Output() refreshRequested = new EventEmitter<void>();

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );
    private readonly translationCache = new Map<string, string>();

    private readonly stateLabelMap: Record<string, string> = {
        terminated: 'REPORTS_PROCESSING.TREATMENT.OPTIONS.STATE.TERMINATED',
        'in-progress': 'REPORTS_PROCESSING.TREATMENT.OPTIONS.STATE.IN_PROGRESS',
        rejected: 'REPORTS_PROCESSING.TREATMENT.OPTIONS.STATE.REJECTED',
    };

    private readonly stateSeverityMap: Record<string, TagSeverity> = {
        terminated: 'success',
        'in-progress': 'warning',
        rejected: 'danger',
    };

    public readonly table: TableConfig = TREATMENT_TABLE_CONST;

    constructor(
        private readonly toastService: ToastrService,
        private readonly clipboardService: ClipboardService,
        private readonly tableExportExcelFileService: TableExportExcelFileService,
        private readonly translate: TranslateService
    ) {}

    public onExportExcel(): void {
        this.listTreatment$.pipe(take(1)).subscribe((treatments) => {
            if (treatments && treatments.length > 0) {
                const fileName = `${this.exportFilePrefix}-treatments`;
                this.tableExportExcelFileService.exportAsExcelFile(
                    treatments,
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
                translationKey =
                    'REPORTS_PROCESSING.TREATMENT.OPTIONS.OPERATOR.ORANGE';
                break;
            case 'mtn':
                translationKey =
                    'REPORTS_PROCESSING.TREATMENT.OPTIONS.OPERATOR.MTN';
                break;
            case 'moov':
                translationKey =
                    'REPORTS_PROCESSING.TREATMENT.OPTIONS.OPERATOR.MOOV';
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
                    'REPORTS_PROCESSING.TREATMENT.OPTIONS.REPORT_TYPE.PARTIAL_SIGNAL';
                break;
            case 'zone blanche':
                translationKey =
                    'REPORTS_PROCESSING.TREATMENT.OPTIONS.REPORT_TYPE.WHITE_ZONE';
                break;
            case "absence d'internet":
                translationKey =
                    'REPORTS_PROCESSING.TREATMENT.OPTIONS.REPORT_TYPE.NO_INTERNET';
                break;
            default:
                return reportType;
        }

        return this.translate.instant(translationKey);
    }

    public onActionClicked(item: TreatmentEntity): void {
        this.treatmentRequested.emit(item);
    }

    public getTreatTooltip(uniqId: string): string {
        const treatLabel = this.translate.instant(
            'REPORTS_PROCESSING.TREATMENT.TABLE.TREAT'
        );
        return `${treatLabel} ${uniqId}`;
    }

    public onJournalClicked(item: TreatmentEntity): void {
        this.journalRequested.emit(item);
    }

    public getStateLabel(state: string | null | undefined): string | null {
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
