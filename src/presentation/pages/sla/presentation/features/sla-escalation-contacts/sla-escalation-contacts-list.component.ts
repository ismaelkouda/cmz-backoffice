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
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { SlaEscalationContactsFacade } from '@pages/sla/application/services/sla/sla-escalation-contacts.facade';
import { SlaEscalationContactFilterApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-escalation-contact-response-api.dto';
import { SLA_ESCALATION_CONTACTS_TABLE } from '@pages/sla/presentation/adapters/sla/sla-escalation-contacts-table.constant';
import { SlaEscalationContactsPresenter } from '@pages/sla/presentation/adapters/sla/sla-escalation-contacts-vm.presenter';
import { SlaEscalationContactVmProps } from '@pages/sla/presentation/adapters/sla/sla-escalation-contacts-vm-props.interface';
import {
    SLA_ESCALATION_CONTACT_FORM_ROUTE,
    SLA_ESCALATION_CONTACT_ROUTE,
} from './sla-escalation-contacts-paths.constants';

type ContactAction = 'view' | 'edit' | 'enable' | 'disable' | 'delete';

@Component({
    selector: 'app-sla-escalation-contacts-list',
    standalone: true,
    imports: [
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
        TranslateModule,
    ],
    templateUrl: './sla-escalation-contacts-list.component.html',
    styleUrls: ['./sla-escalation-contacts-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaEscalationContactsListComponent {
    readonly facade = inject(SlaEscalationContactsFacade);
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);
    private readonly sweetAlert = inject(SweetAlertService);
    private readonly excelExport = inject(ExcelExportService);
    private readonly toast = inject(ToastrService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly languageVersion = signal(0);
    private readonly presenter = new SlaEscalationContactsPresenter(
        this.translate.instant.bind(this.translate)
    );

    readonly tableConfig = SLA_ESCALATION_CONTACTS_TABLE;
    readonly filterForm = new FormGroup({
        search: new FormControl<string | null>(null),
        categories: new FormControl<string[]>([], { nonNullable: true }),
    });
    readonly categoryOptions = [
        { value: 'job', label: 'SLA.ESCALATION_CONTACTS.CATEGORY.JOB' },
        { value: 'system', label: 'SLA.ESCALATION_CONTACTS.CATEGORY.SYSTEM' },
    ];
    readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.languageVersion();
        return [
            {
                type: 'text',
                name: 'search',
                label: 'SLA.ESCALATION_CONTACTS.FILTER.SEARCH',
                placeholder:
                    'SLA.ESCALATION_CONTACTS.FILTER.SEARCH_PLACEHOLDER',
                icon: 'pi pi-search',
            },
            {
                type: 'multi-select',
                name: 'categories',
                label: 'SLA.ESCALATION_CONTACTS.FILTER.CATEGORIES',
                options: this.categoryOptions.map((item) => ({
                    value: item.value,
                    label: this.t(item.label),
                })),
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
            },
        ];
    });
    readonly itemsVM = computed(() => {
        this.languageVersion();
        return this.facade.items().map((item) =>
            this.presenter.map(item, {
                canEdit: this.canEdit(),
                canDelete: this.canDelete(),
            })
        );
    });
    readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.CREATE',
            actionId: 'create',
            icon: 'pi pi-plus',
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
        '/sla/escalation-contact',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/sla/escalation-contact',
        'edit'
    );
    private readonly canDelete = this.permissionActions.can(
        '/sla/escalation-contact',
        'delete'
    );
    private readonly canExport = this.permissionActions.can(
        '/sla/escalation-contact',
        'export'
    );
    private currentFilter: SlaEscalationContactFilterApiDto = {};

    constructor() {
        this.facade.readAll();
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.languageVersion.update((value) => value + 1);
            });
    }

    onFilter(): void {
        const value = this.filterForm.getRawValue();
        this.currentFilter = {
            search: value.search || undefined,
            categories: value.categories.length ? value.categories : undefined,
        };
        this.facade.readAll(this.currentFilter);
    }

    onPageChange(page: number): void {
        this.facade.readAll(this.currentFilter, page + 1);
    }

    onHeaderClicked(actionId: string): void {
        if (actionId === 'create') {
            this.router.navigate(
                [
                    '/sla',
                    SLA_ESCALATION_CONTACT_ROUTE,
                    SLA_ESCALATION_CONTACT_FORM_ROUTE,
                ],
                {
                    queryParams: { ref: 'create' },
                }
            );
        } else if (actionId === 'refresh') {
            this.filterForm.reset({ search: null, categories: [] });
            this.currentFilter = {};
            this.facade.readAll();
        } else if (actionId === 'export') {
            this.exportData();
        }
    }

    onActionClicked(event: {
        item: SlaEscalationContactVmProps;
        actionId?: ContactAction;
    }): void {
        if (!event.actionId) {
            return;
        }
        if (event.actionId === 'view' || event.actionId === 'edit') {
            this.router.navigate(
                [
                    '/sla',
                    SLA_ESCALATION_CONTACT_ROUTE,
                    SLA_ESCALATION_CONTACT_FORM_ROUTE,
                ],
                {
                    queryParams: {
                        ref: event.actionId === 'view' ? 'view' : 'update',
                        uniqId: event.item.id,
                    },
                }
            );
            return;
        }
        this.confirmAction(event.actionId, event.item);
    }

    private async confirmAction(
        action: Exclude<ContactAction, 'edit'>,
        item: SlaEscalationContactVmProps
    ): Promise<void> {
        const confirmed = await this.sweetAlert.confirm({
            titleKey: `SLA.ESCALATION_CONTACTS.SWEET_ALERT.TITLE.${action.toUpperCase()}`,
            messageKey: `SLA.ESCALATION_CONTACTS.SWEET_ALERT.MESSAGE.${action.toUpperCase()}`,
            messageParams: { name: `${item.firstName} ${item.lastName}` },
        });
        if (!confirmed) {
            return;
        }
        if (action === 'enable') {
            this.facade.enable(item.id);
        }
        if (action === 'disable') {
            this.facade.disable(item.id);
        }
        if (action === 'delete') {
            this.facade.remove(item.id);
        }
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
                transform: (
                    value: unknown,
                    row: SlaEscalationContactVmProps
                ) =>
                    col.field === '__index'
                        ? String(items.indexOf(row) + 1)
                        : col.field === 'updatedAt'
                          ? formatDate(String(value ?? ''))
                          : typeof value === 'string' ||
                              typeof value === 'number'
                            ? value
                            : String(value ?? ''),
            }));
        this.excelExport.exportToExcel({
            fileName: 'sla-escalation-contacts',
            columns,
            data: items,
            sheetName: this.t('SLA.ESCALATION_CONTACTS.TITLE'),
            autoFilter: true,
        });
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }
}
