import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SlaFacade } from '@pages/sla/application/services/sla/sla.facade';
import { SLA_SYSTEM_TABLE } from '@pages/sla/presentation/adapters/sla/sla-system-table.constant';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';

@Component({
    selector: 'app-sla-system-list',
    standalone: true,
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        FilterComponent,
        TableComponent,
    ],
    template: `
        <div class="sla-list-content">
            <app-filter
                [formGroup]="form"
                [fields]="fields"
                [isLoading]="facade.systemLoading()"
                (filter)="filter()"
            />
            <hr class="sla-list-divider" />
            <section class="table-section">
                <app-table
                    dataKey="id"
                    [config]="tableConfig"
                    [items]="items()"
                    [loading]="facade.systemLoading()"
                    [headerButtons]="headerButtons()"
                    (headerButtonClicked)="onHeaderClicked($event)"
                />
            </section>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaSystemListComponent {
    readonly facade = inject(SlaFacade);
    private readonly translate = inject(TranslateService);
    private readonly excelExport = inject(ExcelExportService);
    readonly form = new FormGroup({ search: new FormControl('') });
    readonly tableConfig = SLA_SYSTEM_TABLE;
    readonly fields: FilterField[] = [
        {
            name: 'search',
            type: 'text',
            label: 'SLA.SLA_LIST.FILTER.SEARCH',
            placeholder: 'SLA.SLA_LIST.FILTER.SEARCH_PLACEHOLDER',
        },
    ];
    readonly items = computed(() =>
        this.facade.systemItems().map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            statusLabel: this.translate.instant(
                item.isActive ? 'COMMON.ACTIVE' : 'COMMON.INACTIVE'
            ),
            statusStyle: item.isActive
                ? 'COMMON.ACTIVE_STYLE'
                : 'COMMON.INACTIVE_STYLE',
        }))
    );
    readonly headerButtons = computed<TableHeaderButton[]>(() => [
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
            disabled: this.items().length === 0 || this.facade.systemLoading(),
        },
    ]);

    constructor() {
        this.facade.readSystem();
    }

    filter(): void {
        this.facade.readSystem({ search: this.form.value.search ?? undefined });
    }

    onHeaderClicked(actionId: string): void {
        if (actionId === 'refresh') {
            this.form.reset();
            this.facade.readSystem();
        } else if (actionId === 'export') {
            this.exportData();
        }
    }

    private exportData(): void {
        const items = this.items();
        if (!items.length) {
            return;
        }

        const columns: ExportColumn[] = this.tableConfig.cols.map((col) => ({
            field: col.field,
            header: this.translate.instant(col.header),
            width: col.field === '__index' ? 8 : 24,
            transform: (value: unknown, row: (typeof items)[number]) =>
                col.field === '__index'
                    ? items.indexOf(row) + 1
                    : ((value as string | number | null | undefined) ?? ''),
        }));

        this.excelExport
            .exportToExcel({
                fileName: 'sla-system',
                columns,
                data: items,
                sheetName: this.translate.instant('SLA.SLA_LIST.TITLE'),
                autoFilter: true,
            })
            .catch((error) => console.error('SLA system export error', error));
    }
}
