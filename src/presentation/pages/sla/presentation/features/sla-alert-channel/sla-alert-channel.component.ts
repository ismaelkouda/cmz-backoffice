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
import { ToastrService } from 'ngx-toastr';
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
import { SlaAlertChannelUpdateContract } from '@pages/sla/domain/contracts/sla/sla-alert-channel-update.contract';
import { SlaAlertChannelVmProps } from '@pages/sla/presentation/adapters/sla/sla-alert-channel-vm-props.interface';
import { SlaAlertChannelPresenter } from '@pages/sla/presentation/adapters/sla/sla-alert-channel-vm.presenter';
import { SLA_ALERT_CHANNEL_TABLE } from '@pages/sla/presentation/adapters/sla/sla-alert-channel-table.constant';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';

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
    private readonly toast = inject(ToastrService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly languageVersion = signal(0);
    private readonly presenter = new SlaAlertChannelPresenter();

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
        return this.facade.items().map((item) => this.presenter.map(item));
    });
    readonly canEdit = this.permissionActions.can('/sla/channel-alert', 'edit');
    private readonly canExport = this.permissionActions.can(
        '/sla/channel-alert',
        'export'
    );
    private readonly exportTooltip = computed(() => {
        if (!this.canExport()) {
            return this.t('SLA.ALERT_CHANNEL.TOOLTIP.NO_PERMISSION_EXPORT');
        }
        if (!this.itemsVM().length) {
            return this.t('SLA.ALERT_CHANNEL.TOOLTIP.NO_EXPORT');
        }
        return this.t('SLA.ALERT_CHANNEL.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            icon: 'pi pi-refresh',
            class: 'btn-dark',
            translateKey: 'COMMON.REFRESH',
            tooltip: this.t('SLA.ALERT_CHANNEL.TOOLTIP.REFRESH'),
        },
        {
            label: 'COMMON.EXPORT',
            actionId: 'export',
            icon: 'pi pi-file',
            class: 'btn-success',
            translateKey: 'COMMON.EXPORT',
            tooltip: this.exportTooltip(),
            disabled: !this.canExport() || !this.itemsVM().length,
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
            this.facade.readAll(undefined, { forceRefresh: true });
        } else if (actionId === 'export') {
            // if (!this.canExport()) {
            //     this.toast.error(this.exportTooltip());
            //     return;
            // }
            this.exportData();
        }
    }

    onRowEditSaveRequested(
        request: TableRowEditSaveRequest<SlaAlertChannelVmProps>
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

    onRowEditSaved(
        event: TableRowEditSavedEvent<SlaAlertChannelVmProps>
    ): void {
        const item = event.item;
        const enabledByCode: Record<string, boolean> = {
            email: item.email,
            sms: item.sms,
            whatsapp: item.whatsapp,
            telegram: item.telegram,
        };
        const payload: SlaAlertChannelUpdateContract = {
            contacts: [
                {
                    escalationContactId: item.id,
                    channels: item.channels.map((channel) => ({
                        channelId: channel.id,
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
                    this.filterForm.controls.search.value || undefined,
                    { forceRefresh: true }
                );
            },
            event.rollback
        );
    }

    private exportData(): void {
        // if (!this.canExport()) {
        //     this.toast.error(this.exportTooltip());
        //     return;
        // }
        const items = this.itemsVM();
        if (!items.length) {
            this.toast.error(this.t('EXPORT.NO_DATA'));
            return;
        }

        const columns: ExportColumn[] = SLA_ALERT_CHANNEL_TABLE.cols
            .filter((col) => col.field !== '__action')
            .map((col) => {
                const parsedWidth = Number.parseFloat(col.width ?? '15');

                return {
                    field: col.field,
                    header: this.translate.instant(col.header),
                    width: Number.isNaN(parsedWidth) ? 15 : parsedWidth,
                    transform: (value: any, row: any) => {
                        if (col.field === '__index') {
                            return (items.indexOf(row) + 1).toString();
                        }
                        if (Array.isArray(value)) {
                            return value.join(', ');
                        }
                        return value ?? '';
                    },
                };
            });

        this.excelExport
            .exportToExcel({
                fileName: 'sla-alert-channels',
                columns,
                data: items,
                sheetName: this.t('SLA.ALERT_CHANNEL.TITLE'),
                autoFilter: true,
            })
            .catch((error) => {
                console.error('Export error', error);
                this.toast.error(this.t('EXPORT.ERROR'));
            });
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }
}
