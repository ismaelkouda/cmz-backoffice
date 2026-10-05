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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import SweetAlert from 'sweetalert2';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import {
    TableComponent,
    TableRowEditSaveRequest,
    TableRowEditSavedEvent,
} from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { SlaAlertChannelFacade } from '@pages/sla/application/services/sla/sla-alert-channel.facade';
import { SlaAlertContactEntity } from '@pages/sla/domain/entities/sla/sla-alert-contact.entity';
import { SlaAlertUpdatePayloadApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-alert-channel-response-api.dto';
import { SLA_ALERT_CHANNEL_TABLE } from '@pages/sla/presentation/adapters/sla/sla-alert-channel-table.constant';

@Component({
    selector: 'app-sla-alert-channel',
    standalone: true,
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        FilterComponent,
        TableComponent,
    ],
    templateUrl: './sla-alert-channel.component.html',
    styleUrls: ['./sla-alert-channel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaAlertChannelComponent {
    readonly facade = inject(SlaAlertChannelFacade);
    private readonly translate = inject(TranslateService);
    private readonly excelExport = inject(ExcelExportService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly languageVersion = signal(0);

    readonly tableConfig = SLA_ALERT_CHANNEL_TABLE;
    readonly filterForm = new FormGroup({
        search: new FormControl<string | null>(null),
    });
    readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.languageVersion();
        return [
            {
                type: 'text',
                name: 'search',
                label: 'SLA.ALERT_CHANNEL.FILTER.SEARCH',
                placeholder: 'SLA.ALERT_CHANNEL.FILTER.SEARCH_PLACEHOLDER',
                icon: 'pi pi-search',
            },
        ];
    });
    readonly itemsVM = computed(() => {
        this.languageVersion();
        return this.facade.items();
    });
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
            disabled: !this.itemsVM().length,
        },
    ]);

    constructor() {
        this.facade.readAll();
        this.facade.readChannelOptions();
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.languageVersion.update((value) => value + 1));
    }

    onFilter(): void {
        this.facade.readAll(this.filterForm.controls.search.value || undefined);
    }

    onHeaderClicked(actionId: string): void {
        if (actionId === 'refresh') {
            this.filterForm.reset({ search: null });
            this.facade.readAll();
        } else if (actionId === 'export') {
            this.exportData();
        }
    }

    onRowEditSaveRequested(
        request: TableRowEditSaveRequest<SlaAlertContactEntity>
    ): void {
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('SLA.ALERT_CHANNEL.SWEET_ALERT.TITLE'),
            text: this.t('SLA.ALERT_CHANNEL.SWEET_ALERT.MESSAGE'),
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
            backdrop: false,
        }).then((result) => {
            if (result.isConfirmed) {
                request.confirm();
            }
        });
    }

    onRowEditSaved(event: TableRowEditSavedEvent<SlaAlertContactEntity>): void {
        const item = event.item;
        const enabledByCode: Record<string, boolean> = {
            email: item.email,
            sms: item.sms,
            whatsapp: item.whatsapp,
            telegram: item.telegram,
        };
        const payload: SlaAlertUpdatePayloadApiDto = {
            contacts: [
                {
                    escalation_contact_id: item.id,
                    channels: item.channels.map((channel) => ({
                        channel_id: channel.id,
                        enabled: enabledByCode[channel.code] ?? channel.enabled,
                    })),
                },
            ],
        };
        this.facade.update(
            payload,
            () => {
                event.complete();
                this.facade.readAll(
                    this.filterForm.controls.search.value || undefined
                );
            },
            event.rollback
        );
    }

    private exportData(): void {
        const items = this.itemsVM();
        if (!items.length) {
            return;
        }
        const columns: ExportColumn[] = [
            {
                field: 'type',
                header: this.t('SLA.ALERT_CHANNEL.TABLE.TYPE'),
                width: 24,
            },
            {
                field: 'email',
                header: this.t('SLA.ALERT_CHANNEL.TABLE.EMAIL'),
                width: 12,
            },
            {
                field: 'sms',
                header: this.t('SLA.ALERT_CHANNEL.TABLE.SMS'),
                width: 12,
            },
            {
                field: 'whatsapp',
                header: this.t('SLA.ALERT_CHANNEL.TABLE.WHATSAPP'),
                width: 12,
            },
            {
                field: 'telegram',
                header: this.t('SLA.ALERT_CHANNEL.TABLE.TELEGRAM'),
                width: 12,
            },
        ];
        this.excelExport.exportToExcel({
            fileName: 'sla-alert-channels',
            columns,
            data: items,
            sheetName: this.t('SLA.ALERT_CHANNEL.TITLE'),
            autoFilter: true,
        });
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }
}
