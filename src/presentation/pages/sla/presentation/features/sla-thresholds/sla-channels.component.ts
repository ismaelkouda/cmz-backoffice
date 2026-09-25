import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import {
    SlaThresholdsFacade,
    ReportSlaVm,
} from '@pages/sla/application/services/sla/sla-thresholds.facade';
import { SLA_CHANNELS_TABLE } from '@pages/sla/presentation/adapters/sla/sla-channels-table.constant';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TableComponent } from '@shared/components/table/table.component';

const CHANNELS = [
    { value: 'app', label: 'SLA.CHANNELS.APP' },
    { value: 'sms', label: 'SLA.CHANNELS.SMS' },
    { value: 'ussd', label: 'SLA.CHANNELS.USSD' },
    { value: 'ivr', label: 'SLA.CHANNELS.IVR' },
    { value: 'api_client', label: 'SLA.CHANNELS.API_CLIENT' },
];

@Component({
    selector: 'app-sla-channels',
    standalone: true,
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        TabsModule,
        ButtonModule,
        DialogModule,
        InputNumberModule,
        SelectModule,
        BreadcrumbComponent,
        PageTitleComponent,
        TableComponent,
    ],
    templateUrl: './sla-channels.component.html',
    styleUrls: ['./sla-channels.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaChannelsComponent implements OnInit {
    readonly facade = inject(SlaThresholdsFacade);
    private readonly translate = inject(TranslateService);
    private readonly excelExport = inject(ExcelExportService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    readonly channels = CHANNELS;
    readonly activeChannel = signal('app');
    readonly reportTypeId = signal(0);
    readonly visible = signal(false);
    readonly editing = signal<ReportSlaVm | null>(null);
    readonly form = new FormGroup({
        slaId: new FormControl<number | null>(null, Validators.required),
        delay: new FormControl<number | null>(null, [
            Validators.required,
            Validators.min(0),
        ]),
    });
    readonly tableItems = computed(() =>
        this.facade.reportSlas().map((item) => ({
            ...item,
            statusLabel: this.translate.instant(
                item.isActive ? 'SLA.STATUS.ACTIVE' : 'SLA.STATUS.INACTIVE'
            ),
            statusStyle: item.isActive ? 'success' : 'danger',
            dropdownActions: [
                { id: 'edit', label: 'COMMON.EDIT', icon: 'pi pi-pencil' },
                {
                    id: item.isActive ? 'disable' : 'enable',
                    label: item.isActive ? 'COMMON.DISABLE' : 'COMMON.ENABLE',
                    icon: item.isActive ? 'pi pi-times' : 'pi pi-check',
                },
                { id: 'delete', label: 'COMMON.DELETE', icon: 'pi pi-trash' },
            ],
        }))
    );
    readonly headerButtons = computed(() => [
        {
            label: 'COMMON.CREATE',
            actionId: 'create',
            icon: 'pi pi-plus',
            class: 'btn-primary',
            translateKey: 'COMMON.CREATE',
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
            disabled: this.tableItems().length === 0 || this.facade.loading(),
        },
    ]);
    readonly tableConfig = SLA_CHANNELS_TABLE;
    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            const id = Number(params.get('reportTypeId'));
            this.reportTypeId.set(id);
            this.facade.readSlaOptions();
            this.facade.readReportSlas(this.activeChannel(), id);
        });
    }
    selectChannel(channel: string | number | undefined): void {
        const value = String(channel);
        this.activeChannel.set(value);
        this.facade.readReportSlas(value, this.reportTypeId());
    }
    onHeaderClicked(actionId: string): void {
        const actions: Record<string, () => void> = {
            create: () => this.openCreate(),
            refresh: () => this.refresh(),
            export: () => this.exportData(),
        };
        actions[actionId]?.();
    }
    openCreate(): void {
        this.editing.set(null);
        this.form.reset();
        this.visible.set(true);
    }
    onAction(event: {
        item: ReportSlaVm & {
            statusLabel?: string;
            dropdownActions?: unknown[];
        };
        actionId: string;
    }): void {
        const actions: Record<string, () => void> = {
            edit: () => this.openEdit(event.item),
            enable: () => this.facade.enable(event.item.id, this.refresh),
            disable: () => this.facade.disable(event.item.id, this.refresh),
            delete: () => this.facade.delete(event.item.id, this.refresh),
        };
        actions[event.actionId]?.();
    }
    openEdit(item: ReportSlaVm): void {
        this.editing.set(item);
        this.form.patchValue({ slaId: item.slaId, delay: item.delay });
        this.visible.set(true);
    }
    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const value = this.form.getRawValue();
        const payload = {
            report_type_id: this.reportTypeId(),
            sla_id: value.slaId,
            channel: this.activeChannel(),
            delay: value.delay,
            is_active: this.editing()?.isActive ?? true,
        };
        const editing = this.editing();
        if (editing) {
            this.facade.update(editing.id, payload, this.refresh);
        } else {
            this.facade.create(payload, this.refresh);
        }
        this.visible.set(false);
    }
    navigateToParent(): void {
        this.router.navigate(['/sla/thresholds']);
    }
    refresh = (): void =>
        this.facade.readReportSlas(this.activeChannel(), this.reportTypeId());

    private exportData(): void {
        const items = this.tableItems();
        if (!items.length) {
            return;
        }

        const columns: ExportColumn[] = this.tableConfig.cols
            .filter((col) => col.field !== '__actionDropdown')
            .map((col) => ({
                field: col.field,
                header: this.translate.instant(col.header),
                width: col.field === '__index' ? 8 : 20,
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
            }));

        this.excelExport
            .exportToExcel({
                fileName: `sla-${this.activeChannel()}-thresholds`,
                columns,
                data: items,
                sheetName: this.translate.instant('SLA.CHANNELS.TITLE'),
                autoFilter: true,
            })
            .catch((error) =>
                console.error('SLA channels export error', error)
            );
    }
}
