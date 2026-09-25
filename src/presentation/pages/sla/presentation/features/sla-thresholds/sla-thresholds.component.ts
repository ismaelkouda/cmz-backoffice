import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SlaThresholdsFacade } from '@pages/sla/application/services/sla/sla-thresholds.facade';
import { SLA_THRESHOLDS_TABLE } from '@pages/sla/presentation/adapters/sla/sla-thresholds-table.constant';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { formatDate } from '@shared/domain/functions/format-data.function';

@Component({
    selector: 'app-sla-thresholds',
    standalone: true,
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        BreadcrumbComponent,
        PageTitleComponent,
        FilterComponent,
        TableComponent,
    ],
    templateUrl: './sla-thresholds.component.html',
    styleUrls: ['./sla-thresholds.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaThresholdsComponent implements OnInit {
    readonly facade = inject(SlaThresholdsFacade);
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);
    private readonly excelExport = inject(ExcelExportService);
    readonly form = new FormGroup({ search: new FormControl('') });
    readonly fields: FilterField[] = [
        { name: 'search', type: 'text', label: 'SLA.THRESHOLDS.SEARCH' },
    ];
    readonly tableConfig = SLA_THRESHOLDS_TABLE;
    readonly headerButtons = computed<TableHeaderButton[]>(() => [
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
            disabled:
                this.facade.reportTypes().length === 0 || this.facade.loading(),
        },
    ]);
    ngOnInit(): void {
        this.facade.readReportTypes();
    }
    filter(): void {
        this.facade.readReportTypes(this.form.value.search ?? undefined);
    }
    onHeaderClicked(actionId: string): void {
        if (actionId === 'refresh') {
            this.facade.readReportTypes(this.form.value.search ?? undefined);
        } else if (actionId === 'export') {
            this.exportData();
        }
    }
    openChannels(event: { item: { id: number } }): void {
        this.router.navigate(['/sla/thresholds/channels'], {
            queryParams: { reportTypeId: event.item.id },
        });
    }

    private exportData(): void {
        const items = this.facade.reportTypes();
        if (!items.length) {
            return;
        }

        const columns: ExportColumn[] = this.tableConfig.cols.map((col) => ({
            field: col.field,
            header: this.translate.instant(col.header),
            width: col.field === '__index' ? 8 : 24,
            transform: (value: unknown, row: (typeof items)[number]) => {
                if (col.field === '__index') {
                    return items.indexOf(row) + 1;
                }
                if (col.field === 'createdAt' || col.field === 'updatedAt') {
                    return formatDate(String(value ?? ''));
                }
                return (value as string | number | null | undefined) ?? '';
            },
        }));

        this.excelExport
            .exportToExcel({
                fileName: 'sla-thresholds-report-types',
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
