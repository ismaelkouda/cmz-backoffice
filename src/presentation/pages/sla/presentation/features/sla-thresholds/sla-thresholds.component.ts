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
import { SlaThresholdsFacade } from '@pages/sla/application/services/sla/sla-thresholds.facade';
import { SlaThresholdUpdateDto } from '@pages/sla/application/dto/sla/sla-threshold-update.dto';
import { SlaThresholdsVmProps } from '@pages/sla/presentation/adapters/sla/sla-thresholds-vm-props.interface';
import { SlaThresholdsVmPresenter } from '@pages/sla/presentation/adapters/sla/sla-thresholds-vm.presenter';
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
    private readonly presenter = new SlaThresholdsVmPresenter(
        this.translate.instant.bind(this.translate)
    );
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
        // {
        //     name: 'threshold',
        //     type: 'text',
        //     inputType: 'text',
        //     label: 'SLA_THRESHOLDS_FILTER.THRESHOLD',
        // },
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
                        this.normalizeChannel(item.channel) ===
                            selectedChannelCode)
            )
            .map((item) => ({
                ...this.presenter.map(item),
                serviceOptions: this.serviceOptions(),
                indicatorOptions: this.indicatorOptions(),
                channelOptions: this.channelOptions(),
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
        request: TableRowEditSaveRequest<SlaThresholdsVmProps>
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

    onRowEditSaved(event: TableRowEditSavedEvent<SlaThresholdsVmProps>): void {
        const { item } = event;
        const dto: SlaThresholdUpdateDto = {
            id: item.id,
            slaId: item.slaId,
            threshold: item.threshold.toString(),
            criticalThreshold: item.criticalThreshold.toString(),
        };
        this.facade.update(
            dto,
            () => {
                event.complete();
            },
            event.rollback
        );
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    getChannelLabel(channel: string): string {
        const normalizedChannel = this.normalizeChannel(channel);
        const key = `SLA.CHANNELS.${normalizedChannel.toUpperCase()}`;
        const translated = this.translate.instant(key);
        return translated === key ? channel : translated;
    }

    private normalizeChannel(channel: string): string {
        return channel.trim().toLowerCase().replace(/\s+/g, '_');
    }

    refresh = (): void => this.facade.readReportTypes();

    exportData(): void {
        const items = this.itemsVM();
        if (!items.length) {
            return;
        }
        const columns: ExportColumn[] = [
            {
                field: 'slaTypeLabel',
                header: this.t('SLA_THRESHOLDS_FILTER.SERVICE'),
                width: 24,
            },
            {
                field: 'slaName',
                header: this.t('SLA_THRESHOLDS_FILTER.INDICATOR'),
                width: 24,
            },
            {
                field: 'description',
                header: this.t('SLA_THRESHOLDS_FILTER.DESCRIPTION'),
                width: 40,
            },
            {
                field: 'thresholdLabel',
                header: this.t('SLA_THRESHOLDS_FILTER.THRESHOLD'),
                width: 12,
            },
            {
                field: 'criticalThresholdLabel',
                header: this.t('SLA_THRESHOLDS_FILTER.CRITICAL_THRESHOLD'),
                width: 16,
            },
            {
                field: 'channelLabel',
                header: this.t('SLA_THRESHOLDS_FILTER.CHANNEL'),
                width: 18,
            },
            {
                field: 'slaCategoryLabel',
                header: this.t('SLA.SLA_LIST.FILTER.CATEGORY'),
                width: 18,
            },
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
