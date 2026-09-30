import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    Signal,
    computed,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SlaThresholdsFacade } from '@pages/sla/application/services/sla/sla-thresholds.facade';
import { SlaBusinessContactsFacade } from '@pages/sla/application/services/sla/sla-business-contacts.facade';
import { SLA_SERVICES } from '@pages/sla/presentation/adapters/sla/sla-services.constant';
import { SLA_BUSINESS_CONTACT_MANAGEMENT_TABLE } from '@pages/sla/presentation/adapters/sla/sla-business-contact-management-table.constant';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { ToastrService } from 'ngx-toastr';
import { SlaBusinessContactSlaEntity } from '@pages/sla/domain/entities/sla/sla-business-contact-sla.entity';

@Component({
    selector: 'app-sla-business-contacts-management',
    standalone: true,
    imports: [
        FilterComponent,
        TableComponent,
        ReactiveFormsModule,
        TranslateModule,
        ButtonModule,
        DialogModule,
        MultiSelectModule,
    ],
    templateUrl: './sla-business-contacts-management.component.html',
    styleUrls: ['./sla-business-contacts-management.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaBusinessContactsManagementComponent implements OnInit {
    readonly facade = inject(SlaBusinessContactsFacade);
    private readonly thresholdsFacade = inject(SlaThresholdsFacade);
    private readonly translate = inject(TranslateService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly sweetAlert = inject(SweetAlertService);
    private readonly toast = inject(ToastrService);
    private readonly excelExport = inject(ExcelExportService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly currentLang = signal(this.translate.getCurrentLang());
    readonly languageVersion = signal(0);
    readonly tableConfig = SLA_BUSINESS_CONTACT_MANAGEMENT_TABLE;
    readonly contactId = signal<string | number>('');
    readonly contactName = signal('');
    readonly contactEmail = signal('');
    readonly contactPhone = signal('');
    readonly selectedItems = signal<SlaBusinessContactSlaEntity[]>([]);
    readonly displayAffectDialog = signal(false);
    readonly displayReaffectDialog = signal(false);
    readonly affectForm = new FormGroup({
        slaIds: new FormControl<number[]>([], {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(1)],
        }),
    });
    readonly reaffectForm = new FormGroup({
        slaIds: new FormControl<number[]>([], {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(1)],
        }),
    });
    readonly serviceOptions = computed(() => {
        this.languageVersion();
        return SLA_SERVICES.map((service) => ({
            value: service.value,
            label: this.t(service.translationKey),
        }));
    });
    readonly indicatorOptions = computed(() =>
        [
            ...new Map(
                this.thresholdsFacade
                    .reportTypes()
                    .map((item) => [item.slaId, item.slaName])
            ),
        ].map(([id, name]) => ({ id, name }))
    );
    readonly categoryOptions = [
        { value: 'job', label: 'SLA.SLA_LIST.CATEGORY.JOB' },
        { value: 'system', label: 'SLA.SLA_LIST.CATEGORY.SYSTEM' },
    ].map((category) => ({ ...category, label: this.t(category.label) }));
    readonly filterForm = new FormGroup({
        slaType: new FormControl<string | null>(null),
        slaId: new FormControl<number | null>(null),
        slaCategory: new FormControl<string | null>(null),
    });
    readonly filterFields: Signal<FilterField[]> = computed(() => [
        {
            type: 'select',
            name: 'slaType',
            label: 'SLA.BUSINESS_CONTACTS.MANAGEMENT.FILTER.SERVICE',
            options: this.serviceOptions(),
            optionLabel: 'label',
            optionValue: 'value',
            showClear: true,
        },
        {
            type: 'select',
            name: 'slaId',
            label: 'SLA.BUSINESS_CONTACTS.MANAGEMENT.FILTER.INDICATOR',
            options: this.indicatorOptions(),
            optionLabel: 'name',
            optionValue: 'id',
            showClear: true,
        },
        {
            type: 'select',
            name: 'slaCategory',
            label: 'SLA.BUSINESS_CONTACTS.MANAGEMENT.FILTER.CATEGORY',
            options: this.categoryOptions,
            optionLabel: 'label',
            optionValue: 'value',
            showClear: true,
        },
    ]);
    readonly itemsVM = computed(() =>
        this.facade.managementItems().map((item) => ({
            ...item,
            slaTypeLabel: this.getServiceLabel(item.slaType),
            categoryLabel: this.getCategoryLabel(item.slaCategory),
        }))
    );
    readonly availableSlaOptions = computed(() =>
        this.facade.availableSlas().map((item) => ({
            value: item.id,
            label: item.name,
        }))
    );
    readonly assignedSlaOptions = computed(() =>
        this.facade.assignedSlas().map((item) => ({
            value: item.sla_id,
            label: item.sla_name,
        }))
    );
    readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.ASSIGN',
            actionId: 'affect',
            icon: 'pi pi-plus',
            class: 'btn-primary',
            disabled: this.selectedItems().length > 0,
        },
        // Réaffectation désactivée temporairement selon le besoin métier.
        // {
        //     label: 'COMMON.REASSIGN',
        //     actionId: 'reaffect',
        //     icon: 'pi pi-user-edit',
        //     class: 'btn-warning',
        //     disabled: !this.selectedItems().length,
        // },
        {
            label: 'COMMON.REMOVE',
            actionId: 'remove',
            icon: 'pi pi-trash',
            class: 'btn-danger',
            disabled: this.selectedItems().length === 0,
        },
        {
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            icon: 'pi pi-refresh',
            class: 'btn-dark',
            translateKey: 'COMMON.REFRESH',
        },
        {
            label: 'COMMON.EXPORT',
            actionId: 'export',
            icon: 'pi pi-file',
            class: 'btn-success',
            translateKey: 'COMMON.EXPORT',
            disabled: !this.itemsVM().length,
        },
    ]);

    ngOnInit(): void {
        this.route.queryParams
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((params) => {
                const id = params['uniqId'] as string | undefined;
                this.contactId.set(id ?? '');
                this.contactName.set(
                    [params['firstName'], params['lastName']]
                        .filter(Boolean)
                        .join(' ')
                );
                this.contactEmail.set(params['email'] ?? '');
                this.contactPhone.set(params['phone'] ?? '');
                if (id) {
                    this.facade.readManagement(id);
                    this.thresholdsFacade.readReportTypes();
                }
            });
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
                this.languageVersion.update((version) => version + 1);
            });
    }

    onFilter(): void {
        const id = this.contactId();
        if (!id) {
            return;
        }
        const value = this.filterForm.getRawValue();
        this.facade.readManagement(id, {
            sla_type: value.slaType ?? undefined,
            sla_id: value.slaId ?? undefined,
            sla_category: value.slaCategory ?? undefined,
        });
    }

    onSelectionChange(
        selection: SlaBusinessContactSlaEntity | SlaBusinessContactSlaEntity[]
    ): void {
        this.selectedItems.set(
            (Array.isArray(selection) ? selection : [selection]).filter(Boolean)
        );
    }

    onHeaderClicked(actionId: string): void {
        if (actionId === 'affect') {
            this.openAffectDialog();
        }
        if (actionId === 'reaffect') {
            this.openReaffectDialog();
        }
        if (actionId === 'remove') {
            this.removeSelected();
        }
        if (actionId === 'refresh') {
            this.onRefresh();
        }
        if (actionId === 'export') {
            this.exportData();
        }
    }

    openAffectDialog(): void {
        this.affectForm.reset({ slaIds: [] });
        this.facade.readAvailableSlas(this.contactId());
        this.displayAffectDialog.set(true);
    }

    openReaffectDialog(): void {
        this.reaffectForm.reset({ slaIds: [] });
        this.facade.readAssignedSlas(this.contactId());
        this.displayReaffectDialog.set(true);
    }

    closeAffectDialog(): void {
        this.displayAffectDialog.set(false);
        this.affectForm.reset({ slaIds: [] });
    }

    closeReaffectDialog(): void {
        this.displayReaffectDialog.set(false);
        this.reaffectForm.reset({ slaIds: [] });
    }

    submitAffect(): void {
        if (this.affectForm.invalid) {
            this.affectForm.markAllAsTouched();
            return;
        }
        this.facade.affectSlas(this.contactId(), {
            sla_ids: this.affectForm.controls.slaIds.getRawValue(),
        });
        this.closeAffectDialog();
    }

    submitReaffect(): void {
        if (this.reaffectForm.invalid) {
            this.reaffectForm.markAllAsTouched();
            return;
        }
        this.facade.reassignSlas(this.contactId(), {
            sla_ids: this.reaffectForm.controls.slaIds.getRawValue(),
        });
        this.closeReaffectDialog();
    }

    private removeSelected(): void {
        const ids = this.selectedItems().map((item) => item.id);
        if (!ids.length) {
            return;
        }
        this.sweetAlert
            .confirm({
                titleKey:
                    'SLA.BUSINESS_CONTACTS.MANAGEMENT.SWEET_ALERT.TITLE.REMOVE',
                messageKey:
                    'SLA.BUSINESS_CONTACTS.MANAGEMENT.SWEET_ALERT.MESSAGE.REMOVE',
            })
            .then((confirmed) => {
                if (confirmed) {
                    this.facade.removeSlas(this.contactId(), { ids: ids });
                    this.selectedItems.set([]);
                }
            });
    }

    onRefresh(): void {
        this.filterForm.reset();
        this.selectedItems.set([]);
        if (this.contactId()) {
            this.facade.readManagement(this.contactId());
        }
    }

    navigateBack(): void {
        this.router.navigate(['/sla/business-contacts']);
    }

    private exportData(): void {
        const items = this.itemsVM();
        if (!items.length) {
            this.toast.error(this.t('EXPORT.NO_DATA'));
            return;
        }
        const columns: ExportColumn[] = this.tableConfig.cols
            .filter((col) => col.field !== '__selection')
            .map((col) => ({
                field: col.field,
                header: this.t(col.header),
                width: 18,
                transform: (value: unknown, row: (typeof items)[number]) =>
                    col.field === '__index'
                        ? String(items.indexOf(row) + 1)
                        : typeof value === 'string' || typeof value === 'number'
                          ? value
                          : String(value ?? ''),
            }));
        this.excelExport.exportToExcel({
            fileName: 'sla-business-contact-management',
            columns,
            data: items,
            sheetName: this.t('SLA.BUSINESS_CONTACTS.MANAGEMENT.TITLE'),
            autoFilter: true,
        });
    }

    private getCategoryLabel(value: string): string {
        return (
            this.categoryOptions.find((category) => category.value === value)
                ?.label ?? value
        );
    }

    private getServiceLabel(value: string): string {
        const service = SLA_SERVICES.find((item) => item.value === value);
        return service ? this.t(service.translationKey) : value;
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }
}
