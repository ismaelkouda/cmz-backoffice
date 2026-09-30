import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
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
import { Status } from '@pages/settings-security/domain/enums/users/users-status.enum';
import { SlaThresholdsFacade } from '@pages/sla/application/services/sla/sla-thresholds.facade';
import { SlaBusinessContactsFacade } from '@pages/sla/application/services/sla/sla-business-contacts.facade';
import { SLA_SERVICES } from '@pages/sla/presentation/adapters/sla/sla-services.constant';
import { SLA_BUSINESS_CONTACTS_TABLE } from '@pages/sla/presentation/adapters/sla/sla-business-contacts-table.constant';
import { SlaBusinessContactsPresenter } from '@pages/sla/presentation/adapters/sla/sla-business-contacts-vm.presenter';
import { SlaBusinessContactsVmProps } from '@pages/sla/presentation/adapters/sla/sla-business-contacts-vm-props.interface';
import { SLA_BUSINESS_CONTACTS_MANAGEMENT_ROUTE } from './sla-business-contacts-paths.constants';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    FilterField,
    FilterOption,
    enumToFilterOptionsWithValue,
} from '@shared/components/filter/filter.types';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-sla-business-contacts-list',
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
    templateUrl: './sla-business-contacts-list.component.html',
    styleUrls: ['./sla-business-contacts-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaBusinessContactsListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly translate = inject(TranslateService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly sweetAlert = inject(SweetAlertService);
    private readonly toast = inject(ToastrService);
    private readonly excelExport = inject(ExcelExportService);
    private readonly destroyRef = inject(DestroyRef);
    readonly facade = inject(SlaBusinessContactsFacade);
    private readonly thresholdsFacade = inject(SlaThresholdsFacade);
    private readonly currentLang = signal(this.translate.getCurrentLang());
    private readonly presenter = new SlaBusinessContactsPresenter(
        this.translate.instant.bind(this.translate)
    );

    readonly tableConfig = SLA_BUSINESS_CONTACTS_TABLE;
    readonly filterForm = new FormGroup({
        search: new FormControl<string | null>(null),
        slaType: new FormControl<string | null>(null),
        slaId: new FormControl<number | null>(null),
        isActive: new FormControl<boolean | null>(null),
    });
    readonly addForm = new FormGroup({
        userIds: new FormControl<(string | number)[]>([], {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(1)],
        }),
    });
    readonly displayAddDialog = signal(false);
    readonly languageVersion = signal(0);
    readonly statusOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptionsWithValue(Status, this.t.bind(this));
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
    readonly freeMemberOptions = computed(() =>
        this.facade.freeMembers().map((item) => ({
            value: item.id,
            label: `${item.first_name} ${item.last_name}`,
        }))
    );
    readonly filterFields: Signal<FilterField[]> = computed(() => [
        {
            type: 'text',
            name: 'search',
            label: 'SLA.BUSINESS_CONTACTS.FILTER.SEARCH',
            placeholder: 'SLA.BUSINESS_CONTACTS.FILTER.SEARCH_PLACEHOLDER',
            icon: 'pi pi-search',
        },
        {
            type: 'select',
            name: 'slaType',
            label: 'SLA.BUSINESS_CONTACTS.FILTER.SERVICE',
            options: this.serviceOptions(),
            optionLabel: 'label',
            optionValue: 'value',
            showClear: true,
        },
        {
            type: 'select',
            name: 'slaId',
            label: 'SLA.BUSINESS_CONTACTS.FILTER.INDICATOR',
            options: this.indicatorOptions(),
            optionLabel: 'name',
            optionValue: 'id',
            showClear: true,
        },
        {
            type: 'select',
            name: 'isActive',
            label: 'SLA.BUSINESS_CONTACTS.FILTER.STATUS',
            options: [
                { value: true, label: this.t('COMMON.ACTIVE') },
                { value: false, label: this.t('COMMON.INACTIVE') },
            ],
            optionLabel: 'label',
            optionValue: 'value',
            showClear: true,
        },
    ]);
    readonly itemsVM = computed(() => {
        this.currentLang();
        const canEdit = this.canEdit();
        const canDelete = this.canDelete();
        return this.facade
            .contacts()
            .map((item) => this.presenter.map(item, { canEdit, canDelete }));
    });
    readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.CREATE',
            actionId: 'create',
            icon: 'pi pi-user-plus',
            class: 'btn-primary',
            disabled: !this.canCreate(),
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
            disabled: !this.canExport() || !this.itemsVM().length,
        },
    ]);
    private readonly canCreate = this.permissionActions.can(
        '/sla/business-contacts',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/sla/business-contacts',
        'edit'
    );
    private readonly canDelete = this.permissionActions.can(
        '/sla/business-contacts',
        'delete'
    );
    private readonly canExport = this.permissionActions.can(
        '/sla/business-contacts',
        'export'
    );

    constructor() {
        this.facade.readAll();
        this.thresholdsFacade.readReportTypes();
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
                this.languageVersion.update((version) => version + 1);
            });
    }

    onFilter(): void {
        const value = this.filterForm.getRawValue();
        this.facade.readAll({
            search: value.search || undefined,
            sla_type: value.slaType || undefined,
            sla_id: value.slaId ?? undefined,
            is_active: value.isActive ?? undefined,
        });
    }

    onHeaderClicked(actionId: string): void {
        if (actionId === 'create') {
            this.openAddDialog();
        } else if (actionId === 'refresh') {
            this.filterForm.reset();
            this.facade.readAll();
        } else if (actionId === 'export') {
            this.exportData();
        }
    }

    onBadgeClicked(event: { item: SlaBusinessContactsVmProps }): void {
        const item = event.item;
        this.router.navigate([SLA_BUSINESS_CONTACTS_MANAGEMENT_ROUTE], {
            relativeTo: this.route,
            queryParams: {
                uniqId: item.id,
                lastName: item.lastName,
                firstName: item.firstName,
                email: item.email,
                phone: item.phone,
            },
        });
    }

    onActionClicked(event: {
        item: SlaBusinessContactsVmProps;
        actionId: string;
    }): void {
        const id = event.item.id;
        if (event.actionId === 'enable') {
            this.confirmAction('ENABLE', () => this.facade.enable(id));
        } else if (event.actionId === 'disable') {
            this.confirmAction('DISABLE', () => this.facade.disable(id));
        } else if (event.actionId === 'delete') {
            this.confirmAction('DELETE', () => this.facade.remove(id));
        }
    }

    openAddDialog(): void {
        this.addForm.reset({ userIds: [] });
        this.facade.readFreeMembers();
        this.displayAddDialog.set(true);
    }

    closeAddDialog(): void {
        this.displayAddDialog.set(false);
        this.addForm.reset({ userIds: [] });
    }

    submitAdd(): void {
        if (this.addForm.invalid || this.facade.actionLoading()) {
            this.addForm.markAllAsTouched();
            return;
        }
        this.facade.add(
            { user_ids: this.addForm.controls.userIds.getRawValue() },
            () => this.closeAddDialog()
        );
    }

    private confirmAction(
        action: 'ENABLE' | 'DISABLE' | 'DELETE',
        callback: () => void
    ): void {
        this.sweetAlert
            .confirm({
                titleKey: `SLA.BUSINESS_CONTACTS.SWEET_ALERT.TITLE.${action}`,
                messageKey: `SLA.BUSINESS_CONTACTS.SWEET_ALERT.MESSAGE.${action}`,
            })
            .then((confirmed) => {
                if (confirmed) {
                    callback();
                }
            });
    }

    private exportData(): void {
        const items = this.itemsVM();
        if (!items.length) {
            this.toast.error(this.t('EXPORT.NO_DATA'));
            return;
        }
        const columns: ExportColumn[] = this.tableConfig.cols
            .filter((col) => col.field !== '__actionDropdown')
            .map((col) => ({
                field: col.field,
                header: this.t(col.header),
                width: 18,
                transform: (value: unknown, row: SlaBusinessContactsVmProps) =>
                    col.field === '__index'
                        ? String(items.indexOf(row) + 1)
                        : col.field === 'createdAt'
                          ? formatDate(String(value ?? ''))
                          : typeof value === 'string' ||
                              typeof value === 'number'
                            ? value
                            : String(value ?? ''),
            }));
        this.excelExport.exportToExcel({
            fileName: 'sla-business-contacts',
            columns,
            data: items,
            sheetName: this.t('SLA.BUSINESS_CONTACTS.TITLE'),
            autoFilter: true,
        });
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }
}
