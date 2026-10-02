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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import {
    TableComponent,
    TableRowEditSavedEvent,
    TableRowEditSaveRequest,
} from '@shared/components/table/table.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { SLA_THRESHOLDS_TABLE } from '@pages/sla/presentation/adapters/sla/sla-thresholds-table.constant';
import { SLA_SERVICES } from '@pages/sla/presentation/adapters/sla/sla-services.constant';
import {
    ReportTypeVm,
    SlaThresholdsFacade,
} from '@pages/sla/application/services/sla/sla-thresholds.facade';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-sla-thresholds',
    standalone: true,
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        FilterComponent,
        TableComponent,
    ],
    templateUrl: './sla-thresholds.component.html',
    styleUrls: ['./sla-thresholds.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaThresholdsComponent implements OnInit {
    readonly facade = inject(SlaThresholdsFacade);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly excelExport = inject(ExcelExportService);
    readonly filterVersion = signal(0);
    readonly languageVersion = signal(0);
    readonly tableConfig = SLA_THRESHOLDS_TABLE;
    readonly filterForm = new FormGroup({
        service: new FormControl<string | null>(null),
        indicator: new FormControl<string | number | null>(null),
        threshold: new FormControl<string | null>(null),
        channel: new FormControl<string | null>(null),
    });
    readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            class: 'btn-dark',
            icon: 'pi pi-refresh',
            translateKey: 'COMMON.REFRESH',
            tooltip: this.translate.instant('SLA.SLA_LIST.TOOLTIP.REFRESH'),
        },
        {
            label: 'COMMON.EXPORT',
            actionId: 'export',
            class: 'btn-success',
            icon: 'pi pi-file',
            translateKey: 'COMMON.EXPORT',
            tooltip: this.translate
                .instant(
                    this.itemsVM().length
                        ? 'SLA.SLA_LIST.TOOLTIP.EXPORT'
                        : 'SLA.SLA_LIST.TOOLTIP.NO_EXPORT'
                )
                .replace('{nb}', String(this.itemsVM().length)),
            disabled: this.facade.loading() || this.itemsVM().length === 0,
        },
    ]);
    readonly serviceOptions = computed(() => {
        this.languageVersion();
        return SLA_SERVICES.map((service) => ({
            value: service.value,
            label: this.t(service.translationKey),
        }));
    });
    readonly indicatorOptions = computed(() => {
        const options = new Map<string | number, string>();
        this.facade
            .reportTypes()
            .forEach((item) => options.set(item.slaId, item.slaName));
        return [...options].map(([id, name]) => ({ id, name }));
    });
    readonly channelOptions = computed(() => {
        this.languageVersion();
        return this.facade.channelOptions().map((channel) => ({
            value: channel.id,
            label: this.getChannelLabel(channel.name),
        }));
    });
    readonly filterFields: Signal<FilterField[]> = computed(() => [
        {
            name: 'service',
            type: 'select',
            label: this.t('SLA_THRESHOLDS_FILTER.SERVICE'),
            placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
            options: this.serviceOptions(),
            optionLabel: 'label',
            optionValue: 'value',
            icon: 'pi pi-filter',
            showClear: true,
            class: 'p-long',
        },
        {
            name: 'indicator',
            type: 'select',
            label: 'SLA_THRESHOLDS_FILTER.INDICATOR',
            options: this.indicatorOptions(),
            optionLabel: 'name',
            optionValue: 'id',
            showClear: true,
        },
        {
            name: 'threshold',
            type: 'text',
            inputType: 'text',
            label: 'SLA_THRESHOLDS_FILTER.THRESHOLD',
        },
        {
            name: 'channel',
            type: 'select',
            label: 'SLA_THRESHOLDS_FILTER.CHANNEL',
            options: this.channelOptions(),
            optionLabel: 'label',
            optionValue: 'value',
            showClear: true,
        },
    ]);
    readonly itemsVM = computed(() => {
        this.filterVersion();
        const filter = this.filterForm.getRawValue();
        const selectedChannel = this.facade
            .channelOptions()
            .find((channel) => channel.id === filter.channel);
        const selectedChannelCode = selectedChannel
            ? this.normalizeChannel(selectedChannel.name)
            : null;
        return this.facade
            .reportTypes()
            .filter(
                (item) =>
                    (!filter.service || item.slaType === filter.service) &&
                    (!filter.indicator || item.slaId === filter.indicator) &&
                    (!filter.threshold ||
                        item.thresholdLabel
                            .toLowerCase()
                            .includes(filter.threshold.toLowerCase())) &&
                    (!filter.channel ||
                        item.channel === filter.channel ||
                        item.channel === selectedChannelCode)
            )
            .map((item) => ({
                ...item,
                serviceOptions: this.serviceOptions(),
                indicatorOptions: this.indicatorOptions(),
                channelOptions: this.channelOptions(),
                slaTypeLabel: this.getServiceLabel(item.slaType),
                thresholdLabel: item.thresholdLabel,
                channelLabel: this.getChannelLabel(item.channel),
            }));
    });

    ngOnInit(): void {
        this.facade.readReportTypes();
        this.facade.readChannelOptions();
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() =>
                this.languageVersion.update((version) => version + 1)
            );
    }

    filter(): void {
        const { service, channel } = this.filterForm.getRawValue();
        this.facade.readReportTypes(service ?? undefined, channel ?? undefined);
        this.filterVersion.update((version) => version + 1);
    }

    onHeaderClicked(actionId: string): void {
        const actions: Record<string, () => void> = {
            refresh: () => this.onRefreshData(),
            export: () => this.exportData(),
        };
        actions[actionId]?.();
    }

    private onRefreshData(): void {
        this.filterForm.reset();
        this.filter();
        this.refresh();
    }

    onRowEditSaveRequested(
        request: TableRowEditSaveRequest<ReportTypeVm>
    ): void {
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('SLA_THRESHOLDS_CONFIRM.TITLE'),
            text: this.t('SLA_THRESHOLDS_CONFIRM.MESSAGE'),
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                request.confirm();
            }
        });
    }

    onRowEditSaved(event: TableRowEditSavedEvent<ReportTypeVm>): void {
        const { item } = event;
        this.facade.updateReportSla(
            item.id,
            {
                threshold: item.threshold.toString(),
                sla_id: item.slaId,
            },
            () => {
                event.complete();
                this.refresh();
            },
            event.rollback
        );
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    private getServiceLabel(service: string): string {
        const option = SLA_SERVICES.find((item) => item.value === service);
        return option ? this.t(option.translationKey) : service;
    }

    getChannelLabel(channel: string): string {
        const normalizedChannel = this.normalizeChannel(channel);
        const key = `SLA.CHANNELS.${normalizedChannel.toUpperCase()}`;
        const translated = this.translate.instant(key);
        return translated === key ? channel : translated;
    }

    private normalizeChannel(channel: string): string {
        return channel.toLowerCase().replaceAll(' ', '_');
    }

    refresh = (): void => this.facade.readReportTypes();

    exportData(): void {
        const items = this.itemsVM();
        if (!items.length) {
            return;
        }
        const columns: ExportColumn[] = [
            { field: 'slaTypeLabel', header: 'Service', width: 24 },
            { field: 'slaName', header: 'Indicateur', width: 24 },
            { field: 'thresholdLabel', header: 'Seuil', width: 12 },
            { field: 'channel', header: 'Canal', width: 18 },
        ];
        this.excelExport.exportToExcel({
            fileName: 'sla-thresholds',
            columns,
            data: items,
            sheetName: this.translate.instant('SLA.THRESHOLDS.TITLE'),
            autoFilter: true,
        });
    }
}
