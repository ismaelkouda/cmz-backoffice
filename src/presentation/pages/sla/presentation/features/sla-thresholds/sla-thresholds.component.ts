import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    inject,
    input,
    signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SlaThresholdsFacade } from '@pages/sla/application/services/sla/sla-thresholds.facade';
import { SLA_THRESHOLDS_TABLE } from '@pages/sla/presentation/adapters/sla/sla-thresholds-table.constant';
import { SLA_SYSTEM_THRESHOLDS_TABLE } from '@pages/sla/presentation/adapters/sla/sla-system-thresholds-table.constant';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { formatDate } from '@shared/domain/functions/format-data.function';
import {
    SlaSystemFormComponent,
    SlaSystemFormItem,
    SlaSystemFormMode,
} from './sla-system-form.component';

@Component({
    selector: 'app-sla-thresholds',
    standalone: true,
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        FilterComponent,
        TableComponent,
        SlaSystemFormComponent,
    ],
    templateUrl: './sla-thresholds.component.html',
    styleUrls: ['./sla-thresholds.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaThresholdsComponent implements OnInit {
    readonly system = input(false);
    readonly facade = inject(SlaThresholdsFacade);
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);
    private readonly excelExport = inject(ExcelExportService);
    readonly form = new FormGroup({
        search: new FormControl(''),
        status: new FormControl<boolean | null>(null),
    });
    readonly selectedStatus = signal<boolean | null>(null);
    readonly formVisible = signal(false);
    readonly formMode = signal<SlaSystemFormMode>('create');
    readonly selectedSystemItem = signal<SlaSystemFormItem | null>(null);
    readonly fields = computed<FilterField[]>(() => {
        const fields: FilterField[] = [
            {
                name: 'search',
                type: 'text',
                label: 'SLA.THRESHOLDS.SEARCH',
            },
        ];

        if (this.system()) {
            fields.push({
                name: 'status',
                type: 'select',
                label: 'SLA.SLA_LIST.TABLE.STATUS',
                options: [
                    {
                        label: this.translate.instant('COMMON.ACTIVE'),
                        value: true,
                    },
                    {
                        label: this.translate.instant('COMMON.INACTIVE'),
                        value: false,
                    },
                ],
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
            });
        }

        return fields;
    });
    readonly currentTableConfig = computed(() =>
        this.system() ? SLA_SYSTEM_THRESHOLDS_TABLE : SLA_THRESHOLDS_TABLE
    );
    readonly currentItems = computed(() => {
        const items = this.system()
            ? this.facade.reportSystems()
            : this.facade.reportTypes();
        const filteredItems =
            this.system() && this.selectedStatus() !== null
                ? items.filter(
                      (item) => item.isActive === this.selectedStatus()
                  )
                : items;

        return filteredItems.map((item) =>
            this.system()
                ? {
                      ...item,
                      statusLabel: this.translate.instant(
                          item.isActive ? 'COMMON.ACTIVE' : 'COMMON.INACTIVE'
                      ),
                      statusStyle: item.isActive
                          ? 'COMMON.ACTIVE_STYLE'
                          : 'COMMON.INACTIVE_STYLE',
                      dropdownActions: [
                          {
                              id: 'edit',
                              label: 'COMMON.EDIT',
                              icon: 'pi pi-pencil',
                          },
                          {
                              id: item.isActive ? 'disable' : 'enable',
                              label: item.isActive
                                  ? 'COMMON.DISABLE'
                                  : 'COMMON.ENABLE',
                              icon: item.isActive
                                  ? 'pi pi-times'
                                  : 'pi pi-check',
                          },
                          {
                              id: 'delete',
                              label: 'COMMON.DELETE',
                              icon: 'pi pi-trash',
                          },
                      ],
                  }
                : item
        );
    });
    readonly headerButtons = computed<TableHeaderButton[]>(() => [
        ...(this.system()
            ? [
                  {
                      label: 'COMMON.CREATE',
                      actionId: 'create',
                      icon: 'pi pi-plus',
                      class: 'btn-primary',
                      translateKey: 'COMMON.CREATE',
                  },
              ]
            : []),
        {
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            icon: 'pi pi-refresh',
            class: 'btn-dark',
            translateKey: 'COMMON.REFRESH',
            tooltip: this.translate.instant('SLA.SLA_LIST.TOOLTIP.REFRESH'),
        },
        {
            label: 'COMMON.EXPORT',
            actionId: 'export',
            icon: 'pi pi-file',
            class: 'btn-success',
            translateKey: 'COMMON.EXPORT',
            tooltip: this.translate.instant('SLA.SLA_LIST.TOOLTIP.EXPORT'),
            disabled: this.currentItems().length === 0 || this.facade.loading(),
        },
    ]);

    ngOnInit(): void {
        if (this.system()) {
            this.facade.readReportSystems();
        } else {
            this.facade.readReportTypes();
        }
    }

    filter(): void {
        this.selectedStatus.set(this.form.value.status ?? null);
        const search = this.form.value.search ?? undefined;
        if (this.system()) {
            this.facade.readReportSystems(search);
        } else {
            this.facade.readReportTypes(search);
        }
    }

    onHeaderClicked(actionId: string): void {
        if (actionId === 'create') {
            this.openCreate();
        } else if (actionId === 'refresh') {
            this.filter();
        } else if (actionId === 'export') {
            this.exportData();
        }
    }

    onAction(event: {
        item: SlaSystemFormItem & { dropdownActions?: unknown[] };
        actionId: string;
    }): void {
        if (!this.system()) {
            return;
        }

        const actions: Record<string, () => void> = {
            edit: () => this.openEdit(event.item),
            enable: () => this.facade.enableSystem(event.item.id, this.refresh),
            disable: () =>
                this.facade.disableSystem(event.item.id, this.refresh),
            delete: () => this.facade.deleteSystem(event.item.id, this.refresh),
        };
        actions[event.actionId]?.();
    }

    openCreate(): void {
        this.formMode.set('create');
        this.selectedSystemItem.set(null);
        this.formVisible.set(true);
    }

    openEdit(item: SlaSystemFormItem): void {
        this.formMode.set('edit');
        this.selectedSystemItem.set(item);
        this.formVisible.set(true);
    }

    onFormClosed(): void {
        this.formVisible.set(false);
    }

    onFormSaved(value: { name: string; description: string }): void {
        const item = this.selectedSystemItem();
        const refresh = this.refresh;
        if (item) {
            this.facade.updateSystem(item.id, value, refresh);
        } else {
            this.facade.createSystem(value, refresh);
        }
        this.formVisible.set(false);
    }

    refresh = (): void => {
        this.facade.readReportSystems(this.form.value.search ?? undefined);
    };

    openChannels(event: { item: { id: number; name: string } }): void {
        this.router.navigate(['/sla/thresholds/channels'], {
            queryParams: {
                reportTypeId: event.item.id,
                reportTypeName: event.item.name,
            },
        });
    }

    private exportData(): void {
        const items = this.currentItems();
        if (!items.length) {
            return;
        }

        const columns: ExportColumn[] = this.currentTableConfig().cols.map(
            (col) => ({
                field: col.field,
                header: this.translate.instant(col.header),
                width: col.field === '__index' ? 8 : 24,
                transform: (value: unknown, row: (typeof items)[number]) => {
                    if (col.field === '__index') {
                        return items.indexOf(row) + 1;
                    }
                    if (
                        col.field === 'createdAt' ||
                        col.field === 'updatedAt'
                    ) {
                        return formatDate(String(value ?? ''));
                    }
                    return (value as string | number | null | undefined) ?? '';
                },
            })
        );

        this.excelExport
            .exportToExcel({
                fileName: `sla-thresholds-${this.system() ? 'system' : 'business'}`,
                columns,
                data: items,
                sheetName: this.translate.instant('SLA.THRESHOLDS.TITLE'),
                autoFilter: true,
            })
            .catch((error) =>
                console.error('SLA thresholds export error', error)
            );
    }
}
