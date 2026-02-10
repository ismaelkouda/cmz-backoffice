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
import { FormBuilder, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import SweetAlert from 'sweetalert2';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';

import { QueuesFacade } from '@presentation/pages/reports-processing/application/queues.facade';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';

import { ManagementFacade } from '../../application/management.facade';
import { QUEUES_TABLE_CONST } from '../../domain/constants/queues-table.constant';
import { QueuesFilterFormControlEntity } from '../../domain/entities/queues/queues-filter-form-control.entity';
import { QueuesEntity } from '../../domain/entities/queues/queues.entity';

import { QueuesHelperService } from './queues-helper.service';

@Component({
    selector: 'app-queues',
    standalone: true,
    templateUrl: './queues.component.html',
    styleUrls: ['./queues.component.scss'],
    imports: [
        CommonModule,
        FilterComponent,
        BreadcrumbComponent,
        TableComponent,
        ManagementComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueuesComponent implements OnInit {
    readonly hasAnimated = computed(() => this.items().length === 0);
    private readonly title = inject(Title);
    public readonly facade = inject(QueuesFacade);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly helperService = inject(QueuesHelperService);
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly submitFacade = inject(ManagementFacade);

    public readonly tableConfig = QUEUES_TABLE_CONST;

    readonly items = toSignal(this.facade.queues$, {
        initialValue: [],
    });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.config.app.name
    );
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
                label: this.t('REPORTS_PROCESSING.QUEUES.FILTER.INITIATOR'),
                placeholder: this.t('COMMON.PHONE_PLACEHOLDER'),
                icon: 'pi pi-phone',
                translationKeys: {
                    label: 'REPORTS_PROCESSING.QUEUES.FILTER.INITIATOR',
                    placeholder: 'COMMON.PHONE_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'uniqId',
                label: this.t('REPORTS_PROCESSING.QUEUES.FILTER.UNIQ_ID'),
                placeholder: this.t('COMMON.REPORT_UNIQ_ID_PLACEHOLDER'),
                icon: 'pi pi-id-card',
                translationKeys: {
                    label: 'REPORTS_PROCESSING.QUEUES.FILTER.UNIQ_ID',
                    placeholder: 'COMMON.REPORT_UNIQ_ID_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'reportType',
                label: this.t('REPORTS_PROCESSING.QUEUES.FILTER.REPORT_TYPE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportTypeOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REPORTS_PROCESSING.QUEUES.FILTER.REPORT_TYPE',
                },
            },
            {
                type: 'multi-select',
                name: 'operators',
                label: this.t('REPORTS_PROCESSING.QUEUES.FILTER.OPERATORS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: telecomOperatorsOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REPORTS_PROCESSING.QUEUES.FILTER.OPERATORS',
                },
            },
            {
                type: 'select',
                name: 'source',
                label: this.t('REPORTS_PROCESSING.QUEUES.FILTER.SOURCE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportSourceOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REPORTS_PROCESSING.QUEUES.FILTER.SOURCE',
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

    readonly form = this.fb.group<QueuesFilterFormControlEntity>({
        initiatorPhoneNumber: new FormControl<string>('', {
            nonNullable: true,
        }),
        uniqId: new FormControl<string>('', {
            nonNullable: true,
        }),
        startDate: new FormControl<string>('', {
            nonNullable: true,
        }),
        endDate: new FormControl<string>('', {
            nonNullable: true,
        }),
        reportType: new FormControl<string>('', {
            nonNullable: true,
        }),
        operators: new FormControl<string[]>([], {
            nonNullable: true,
        }),
        source: new FormControl<string>('', {
            nonNullable: true,
        }),
    });

    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    // private readonly formStateEffect = effect(() => {
    //     const state = this.submitFacade.actionState();
    //     if (state === 'loading') {
    //         this.form.disable({ emitEvent: false });
    //     } else {
    //         this.form.enable({ emitEvent: false });
    //     }
    // });

    // private readonly successEffect = effect(() => {
    //     const current = this.submitFacade.actionSuccess();
    //     if (current === this.lastSuccess) {
    //         return;
    //     }

    //     this.lastSuccess = current;
    //     this.navigateToBack();
    // });

    public readonly selectedInTable = signal<QueuesEntity[]>([]);

    public readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.TAKE',
            actionId: CrudFormType.TAKE,
            class: 'btn-primary',
            icon: 'pi pi-plus',
            translateKey: 'COMMON.TAKE',
        },
    ]);

    constructor() {
        this.facade.execute();
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
        this.title.setTitle(this.t('REPORTS_PROCESSING.QUEUES.TITLE'));

        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.title.setTitle(this.t('REPORTS_PROCESSING.QUEUES.TITLE'));
            });
    }

    public onFilterClicked(filterValues: any): void {
        this.facade.execute(filterValues, '1', true);
    }

    public onPageChange(event: number): void {
        this.facade.changePage(event + 1);
    }

    public onHeaderButtonClicked(actionId: string): void {
        if (actionId === CrudFormType.TAKE) {
            const title = this.helperService.getSweetAlertTitle();
            const message = this.helperService.getSweetAlertMessage();
            SweetAlert.fire({
                ...SWEET_ALERT_PARAMS,
                title: this.translate.instant(title),
                text: this.translate.instant(message),
                backdrop: false,
                confirmButtonText: this.t('COMMON.CONFIRM'),
                cancelButtonText: this.t('COMMON.CANCEL'),
            }).then((res) => {
                if (res.isConfirmed) {
                    // this.submitFacade.take(item.uniqId);
                    // this.facade.refreshWithLastFilterAndPage();
                }
            });
        }
    }

    public onActionClicked(event: {
        item: QueuesEntity;
        actionId?: string;
    }): void {
        const { item } = event;
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible = true;
    }

    public onSelectionChange(selection: QueuesEntity | QueuesEntity[]): void {
        const queues = Array.isArray(selection) ? selection : [selection];
        this.selectedInTable.set(queues.filter((u) => !!u));
    }

    public onRefresh(): void {
        this.facade.refresh();
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    private normalizeExportPrefix(name: string): string {
        return (
            name
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }
}
