import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    Signal,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { AllFacade } from '@pages/processing/application/services/all/all.facade';
import { ALL_TABLE } from '@pages/processing/domain/constants/all/all-table.constants';
import { AllFilterControl } from '@pages/processing/domain/controls/all/all-filter-control';
import { AllEntity } from '@pages/processing/domain/entities/all/all.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { ManagementDialogComponent } from '@shared/components/management/presentation/management-dialog/management-dialog.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-all',
    standalone: true,
    templateUrl: './all.component.html',
    styleUrls: ['./all.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        TableComponent,
        ManagementDialogComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        ReactiveFormsModule,
        FilterComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    public readonly facade = inject(AllFacade);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.config.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;
    public selectedManagementType: string | null = null;
    public readonly tableConfig = ALL_TABLE;
    readonly items = toSignal(this.facade.items$, {
        initialValue: [],
    });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly telecomOperatorsOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(TelecomOperator, this.t.bind(this));
    });
    readonly reportSourceOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(ReportSource, this.t.bind(this));
    });
    readonly reportTypeOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(ReportType, this.t.bind(this));
    });
    readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        const telecomOperatorsOpts = this.telecomOperatorsOptions();
        const reportSourceOpts = this.reportSourceOptions();
        const reportTypeOpts = this.reportTypeOptions();

        return [
            {
                type: 'text',
                name: 'initiatorPhoneNumber',
                label: this.t('PROCESSING.ALL.FILTER.INITIATOR'),
                placeholder: this.t('COMMON.PHONE_PLACEHOLDER'),
                icon: 'pi pi-phone',
                translationKeys: {
                    label: 'PROCESSING.ALL.FILTER.INITIATOR',
                    placeholder: 'COMMON.PHONE_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'uniqId',
                label: this.t('PROCESSING.ALL.FILTER.UNIQ_ID'),
                placeholder: this.t('COMMON.REPORT_UNIQ_ID_PLACEHOLDER'),
                icon: 'pi pi-id-card',
                translationKeys: {
                    label: 'PROCESSING.ALL.FILTER.UNIQ_ID',
                    placeholder: 'COMMON.REPORT_UNIQ_ID_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'reportType',
                label: this.t('PROCESSING.ALL.FILTER.REPORT_TYPE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportTypeOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'PROCESSING.ALL.FILTER.REPORT_TYPE',
                },
                class: 'p-long',
            },
            {
                type: 'multi-select',
                name: 'operators',
                label: this.t('PROCESSING.ALL.FILTER.OPERATORS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: telecomOperatorsOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'PROCESSING.ALL.FILTER.OPERATORS',
                },
                class: 'p-medium',
            },
            {
                type: 'select',
                name: 'source',
                label: this.t('PROCESSING.ALL.FILTER.SOURCE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportSourceOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'PROCESSING.ALL.FILTER.SOURCE',
                },
            },
            {
                type: 'date',
                name: 'startDate',
                label: 'COMMON.START_DATE',
                placeholder: 'COMMON.DATE_PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'COMMON.END_DATE',
                placeholder: 'COMMON.DATE_PLACEHOLDER',
            },
        ];
    });
    readonly form = this.fb.group<AllFilterControl>({
        initiatorPhoneNumber: new FormControl<string>('', {
            nonNullable: true,
        }),
        uniqId: new FormControl<string>('', {
            nonNullable: true,
        }),
        reportType: new FormControl<string | null>(null, {
            nonNullable: true,
        }),
        operators: new FormControl<string[]>([], {
            nonNullable: true,
        }),
        source: new FormControl<string | null>(null, {
            nonNullable: true,
        }),
        startDate: new FormControl<string>('', {
            nonNullable: true,
        }),
        endDate: new FormControl<string>('', {
            nonNullable: true,
        }),
    });

    constructor() {
        this.facade.read();
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });

        effect(() => {
            this.filterFields();
            this.telecomOperatorsOptions();
            this.reportSourceOptions();
            this.reportTypeOptions();
        });
    }

    ngOnInit(): void {
        this.title.setTitle(this.t('PROCESSING.ALL.TITLE'));

        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.title.setTitle(this.t('PROCESSING.ALL.TITLE'));
            });
    }

    public onFilterClicked(filterValues: any): void {
        this.facade.read(filterValues, '1', true);
    }

    public onRefreshClicked(): void {
        this.form.reset();
        this.facade.refresh();
    }

    public onPageChange(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }

    public onActionClicked(event: {
        item: AllEntity;
        actionId?: string;
    }): void {
        const { item } = event;
        this.selectedReportId = item.uniqId;
        this.selectedManagementType = item.type;
        this.reportTreatmentVisible = true;
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    public onExportClicked(): void {
        const tasks = this.items();
        if (tasks && tasks.length > 0) {
            const fileName = `${this.exportFilePrefix}-tasks`;
            this.exportService.exportAsExcelFile(
                tasks,
                this.tableConfig,
                fileName
            );
        } else {
            this.toast.error(this.translate.instant('EXPORT.NO_DATA'));
        }
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
