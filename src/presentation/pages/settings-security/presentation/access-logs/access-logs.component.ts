import { CommonModule } from "@angular/common";
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AccessLogsFacade } from "@presentation/pages/settings-security/core/application/services/access-logs/access-logs.facade";
import { ACCESS_LOGS_TABLE_CONSTANT } from "@presentation/pages/settings-security/core/domain/constants/access-logs/access-logs-table.constant";
import { AccessLogsFilterControl } from "@presentation/pages/settings-security/core/domain/controls/access-logs/access-logs-filter.control";
import { AccessLogsEntity } from "@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs.entity";
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
import { FilterComponent } from "@shared/components/filter/filter.component";
import { FilterField, FilterOption } from "@shared/components/filter/filter.types";
import { PageTitleComponent } from "@shared/components/page-title/page-title.component";
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { TableComponent } from "@shared/components/table/table.component";
import { Paginate } from "@shared/data/dtos/simple-response.dto";
import { parseAndValidateDateRange } from "@shared/domain/utils/date-range.utils";
import { AppCustomizationService } from "@shared/services/app-customization.service";
import { TableExportExcelFileService } from "@shared/services/table-export-excel-file.service";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-access-logs',
    standalone: true,
    templateUrl: './access-logs.component.html',
    styleUrls: ['./access-logs.component.scss'],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        BreadcrumbComponent,
        PageTitleComponent,
        FilterComponent,
        TableComponent,
        PaginationComponent
    ]
})
export class AccessLogsComponent implements OnInit {
    private readonly title = inject(Title);
    public readonly facade = inject(AccessLogsFacade);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly tableExportExcelFileService = inject(TableExportExcelFileService);
    private readonly appCustomizationService = inject(AppCustomizationService);

    public readonly tableConfig = ACCESS_LOGS_TABLE_CONSTANT;

    readonly isLoading = toSignal(this.facade.isLoading$, { initialValue: false });
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly pagination = toSignal(this.facade.pagination$, { initialValue: {} as Paginate<AccessLogsEntity> });

    public formFilter!: FormGroup<AccessLogsFilterControl>;
    public actionsOptions = signal<FilterOption[]>([]);

    // Computed properties
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    constructor() {
        this.setPageTitle();

        // Load data on initialization
        effect(() => {
            this.facade.readAll();
        }, { allowSignalWrites: true });
    }

    ngOnInit(): void {
        this.loadTranslatedOptions();
        this.initFilter();
    }

    private setPageTitle(): void {
        // CORRECTION: Utiliser le bon chemin de traduction
        this.title.setTitle(this.translate.instant("SETTINGS_SECURITY.ACCESS_LOGS.TITLE"));
    }

    private loadTranslatedOptions(): void {
        // Déplacer ces options dans les fichiers de traduction si possible
        // Pour l'instant, on garde mais on pourrait utiliser des traductions
        this.actionsOptions.set([
            { label: this.translate.instant('SETTINGS_SECURITY.ACCESS_LOGS.FILTER.ACTIONS_OPTIONS.LOGIN'), value: 'login' },
            { label: this.translate.instant('SETTINGS_SECURITY.ACCESS_LOGS.FILTER.ACTIONS_OPTIONS.LOGOUT'), value: 'logout' },
            { label: this.translate.instant('SETTINGS_SECURITY.ACCESS_LOGS.FILTER.ACTIONS_OPTIONS.ATTEMPTED_LOGIN'), value: 'attempted_login' },
            { label: this.translate.instant('SETTINGS_SECURITY.ACCESS_LOGS.FILTER.ACTIONS_OPTIONS.BLOCKED_ATTEMPTED_LOGIN'), value: 'blocked_attempted_login' },
            { label: this.translate.instant('SETTINGS_SECURITY.ACCESS_LOGS.FILTER.ACTIONS_OPTIONS.ATTEMPTS_EXCEEDED'), value: 'attempts_exceeded' }
        ]);
    }

    private initFilter(): void {
        this.formFilter = this.fb.group<AccessLogsFilterControl>({
            search: new FormControl<string | null>(null),
            action: new FormControl<string | null>(null),
            startDate: new FormControl<string | null>(null),
            endDate: new FormControl<string | null>(null),
        });
    }

    public filterFields(): FilterField[] {
        return [
            {
                type: 'text',
                name: 'search',
                label: 'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.SEARCH',
                placeholder: 'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.SEARCH_PLACEHOLDER',
            },
            {
                label: 'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.ACTION',
                name: 'action',
                type: 'select',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                options: this.actionsOptions(),
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                filter: true,
            },
            {
                type: 'date',
                name: 'startDate',
                label: 'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.DATE.FROM',
                placeholder: 'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.DATE.TO',
                placeholder: 'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.DATE.PLACEHOLDER',
            }
        ];
    }

    public filter(formValue: any): void {
        const { startDate, endDate, isValidRange } = parseAndValidateDateRange(
            formValue.startDate,
            formValue.endDate
        );

        if (!isValidRange) {
            this.toastService.error(
                this.translate.instant('COMMON.INVALID_DATE_RANGE')
            );
            return;
        }

        const filter = {
            search: formValue.search,
            action: formValue.action,
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD')
        };

        this.facade.readAll(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.facade.changePage(event + 1);
    }

    public refresh(): void {
        this.formFilter.reset();
        this.facade.refresh();
    }

    public onExportExcel(): void {
        const accessLogs = this.items();

        if (!accessLogs || accessLogs.length === 0) {
            this.toastService.error(this.translate.instant('EXPORT.NO_DATA'));
            return;
        }

        const fileName = `${this.exportFilePrefix}-access-logs`;
        this.tableExportExcelFileService.exportAsExcelFile(
            accessLogs,
            this.tableConfig,
            fileName
        );
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