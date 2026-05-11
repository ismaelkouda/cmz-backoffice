import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    OnDestroy,
    OnInit,
    output,
    signal,
    Signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DetailsEntity as FinalizationEntity } from '@pages/finalization/domain/entities/details/details.entity';
import { DetailsEntity as ProcessingEntity } from '@pages/processing/domain/entities/details/details.entity';
import { DetailsEntity as RequestsEntity } from '@pages/requests/domain/entities/details/details.entity';
import {
    enumToFilterOptions,
    enumToFilterValueOptions,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { TABS } from '@shared/components/management/domain/constants/management-tabs.contant';
import { CallbackTypes } from '@shared/components/management/domain/enums/management-callback.enum';
import { Motifs } from '@shared/components/management/domain/enums/management-motif.enum';
import { ManagementStateService } from '@shared/components/management/domain/services/management-state.service';
import { ManagementValidationService } from '@shared/components/management/domain/services/management-validation.service';
import { ManagementCallbackComponent } from '@shared/components/management/presentation/management-callback/management-callback.component';
import { ManagementChatbotPanelComponent } from '@shared/components/management/presentation/management-chatbot-panel/management-chatbot-panel.component';
import { ManagementHeaderComponent } from '@shared/components/management/presentation/management-header/management-header.component';
import { ManagementInfoPanelComponent } from '@shared/components/management/presentation/management-info-panel/management-info-panel.component';
import { ManagementMapComponent } from '@shared/components/management/presentation/management-map/management-map.component';
import { ManagementPhotosPanelComponent } from '@shared/components/management/presentation/management-photos-panel.component.html/management-photos-panel.component';
import { ManagementSidebarComponent } from '@shared/components/management/presentation/management-sidebar/management-sidebar.component';
import { ManagementTreatmentFormComponent } from '@shared/components/management/presentation/management-treatment-form/management-treatment-form.component';
import { ManagementFormStore } from '@shared/components/management/presentation/store/management-form.store';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { LocationName } from '@shared/domain/enums/location-name.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { operatorsTagStyle } from '@shared/domain/functions/operators-tag-style.function';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-management-dialog',
    standalone: true,
    templateUrl: './management-dialog.component.html',
    styleUrls: ['./management-dialog.component.scss'],
    imports: [
        CommonModule,
        TranslateModule,
        ButtonModule,
        DialogModule,
        SkeletonModule,
        TooltipModule,
        SelectModule,
        ReactiveFormsModule,
        ManagementHeaderComponent,
        ManagementSidebarComponent,
        ManagementCallbackComponent,
        ManagementPhotosPanelComponent,
        ManagementMapComponent,
        ManagementInfoPanelComponent,
        ManagementChatbotPanelComponent,
        ManagementTreatmentFormComponent,
        TagModule,
    ],
    providers: [
        MessageService,
        ManagementValidationService,
        ManagementStateService,
        ManagementFormStore,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementDialogComponent implements OnInit, OnDestroy {
    private readonly store = inject(ManagementFormStore);
    private readonly toastService = inject(ToastrService);
    private readonly translate = inject(TranslateService);
    private readonly validationService = inject(ManagementValidationService);
    private readonly stateService = inject(ManagementStateService);
    private readonly clipboardService = inject(ClipboardService);
    protected readonly visible = input.required<boolean>();
    protected readonly uniqId = input.required<string>();
    protected readonly type = input.required<TypeReport>();
    protected readonly visibleChange = output<boolean>();
    protected readonly closed = output();
    protected isTreatmentFormExpanded = true;
    protected readonly form = this.store.form;
    protected readonly items = this.stateService.items;
    protected readonly loading = this.stateService.loading;
    protected readonly actionState = this.stateService.actionState;
    protected readonly sweetAlert = this.stateService.sweetAlert;
    protected readonly canQualify = this.stateService.canQualify;
    protected readonly canTreat = this.stateService.canTreat;
    protected readonly canFinalize = this.stateService.canFinalize;
    protected readonly submitting = computed(() => this.actionState());
    // protected readonly canExecuteQualify = computed(() => {
    //     const item = this.items();
    //     return item?.canQualify && this.canQualify() && this.submitting();
    // });
    // protected readonly canExecuteTreat = computed(() => {
    //     const item = this.items();
    //     return item?.canTreat && this.canTreat() && this.submitting();
    // });
    // protected readonly canExecuteFinalize = computed(() => {
    //     const item = this.items();
    //     return item?.canFinalize && this.canFinalize() && this.submitting();
    // });
    protected readonly photoTabInstanceId = computed(
        () => `management-photo-${this.uniqId()}`
    );
    protected readonly selectedTab = signal('information');
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    protected readonly motifOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Motifs, this.t.bind(this), 'toUpperCase');
    });
    protected readonly callbackTypesOptions: Signal<FilterOption[]> = computed(
        () => {
            this.currentLang();
            return enumToFilterOptions(
                CallbackTypes,
                this.t.bind(this),
                'toUpperCase'
            );
        }
    );
    protected readonly reportTypeOptions: Signal<FilterOption[]> = computed(
        () => {
            this.currentLang();
            return enumToFilterOptions(ReportType, this.t.bind(this));
        }
    );
    protected readonly telecomOperatorsOptions: Signal<FilterOption[]> =
        computed(() => {
            this.currentLang();
            return enumToFilterOptions(TelecomOperator, this.t.bind(this));
        });
    protected readonly locationNameOptions: Signal<FilterOption[]> = computed(
        () => {
            this.currentLang();
            return enumToFilterValueOptions(LocationName, this.t.bind(this));
        }
    );
    protected readonly tabs = computed(() => {
        const type = this.type();
        if (type === TypeReport.REQUESTS) {
            return TABS.filter((tab) => tab.value !== 'chatbot');
        }
        return TABS;
    });
    private readonly storeEffect = effect(() => {
        const item = this.items();
        if (item && this.uniqId()) {
            this.store.setItem(item);
        }
    });
    private readonly validationEffect = effect(() => {
        if (this.items() && this.type()) {
            this.validationService.configureFormValidators(
                this.form,
                this.type(),
                this.items()
            );
        }
    });
    private readonly loadingEffect = effect(() => {
        if (this.submitting()) {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }
    });
    private lastHandledSuccess = 0;
    private readonly successEffect = effect(() => {
        const success = this.stateService.actionSuccess();
        if (success > this.lastHandledSuccess) {
            this.lastHandledSuccess = success;
            this.onCloseDialog();
        }
    });
    ngOnInit(): void {
        this.stateService.initialize(this.type(), this.uniqId());
    }
    ngOnDestroy(): void {
        this.stateService.reset();
    }
    protected selectTab(index: number): void {
        const tab = this.tabs()[index];
        if (tab) {
            this.selectedTab.set(tab.value);
        }
    }
    protected toggleTreatmentForm(): void {
        this.isTreatmentFormExpanded = !this.isTreatmentFormExpanded;
        if (this.isTreatmentFormExpanded) {
            this.markFormAsTouched();
        }
    }
    protected getToggleButtonIcon(): string {
        return this.isTreatmentFormExpanded
            ? 'pi pi-chevron-down'
            : 'pi pi-chevron-up';
    }
    protected openTreatmentForm(): void {
        this.isTreatmentFormExpanded = true;
        this.markFormAsTouched();
    }
    protected closeTreatmentForm(): void {
        this.isTreatmentFormExpanded = false;
    }
    protected copyToClipboard(value: string): void {
        this.clipboardService.copyFromContent(value);
        this.toastService.success(this.t('COMMON.COPIED_TO_CLIPBOARD'));
    }
    protected onValidReportTreatment(): void {
        const items = this.items();
        if (!this.uniqId() || !items || !this.type()) {
            return;
        }
        if (!this.validateForm()) {
            return;
        }
        this.showConfirmationDialog();
    }
    private validateForm(): boolean {
        this.form.updateValueAndValidity({ emitEvent: false });
        if (this.form.invalid) {
            this.markFormAsTouched();
            return false;
        }
        return true;
    }

    protected setApprovalType(approvalType: string): void {
        this.store.setApprovalType(
            approvalType as 'edit' | 'callback' | 'view'
        );
    }
    protected setDecision(decision: string): void {
        this.store.setDecision(decision as 'accepted' | 'rejected');
    }
    protected onCloseDialog(): void {
        SweetAlert.close();
        this.visibleChange.emit(false);
        this.stateService.reset();
    }
    protected getOperatorTagStyle(operator: string): Record<string, string> {
        return operatorsTagStyle(operator);
    }
    protected trackByTab(_: number, tab: { value: string }): string {
        return tab.value;
    }
    private markFormAsTouched(): void {
        Object.values(this.form.controls).forEach((control) =>
            control.markAsTouched()
        );
    }
    private showConfirmationDialog(): void {
        const items = this.items();
        const { title, message } = this.getSweetAlertLabels(items);
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(title),
            html: `${this.t(message).replaceAll('uniqId', this.uniqId())}`,
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed && this.form.valid) {
                this.executeAction(this.getActionType(), this.form.value);
            }
        });
    }
    private getActionType(): string {
        const items = this.items();
        if (items?.canTake) {
            return 'take';
        }
        if ((items as RequestsEntity).canQualify) {
            return this.form.get('decision')?.value === 'rejected'
                ? 'reject'
                : 'approve';
        }
        if ((items as ProcessingEntity).canTreat) {
            return 'treat';
        }
        if ((items as FinalizationEntity).canBeFinalized) {
            return 'finalize';
        }
        return 'see';
    }
    private executeAction(action: string, payload: any): void {
        this.stateService.executeAction(action, payload);
    }
    private getSweetAlertLabels(item: any): { title: string; message: string } {
        if (item?.canTake) {
            return {
                title: this.t(this.sweetAlert().title),
                message: this.t(this.sweetAlert().message),
            };
        } else if (item?.canQualify) {
            const decision = this.form.get('decision')?.value;
            if (decision === 'rejected') {
                return {
                    title: 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.REJECT.TITLE',
                    message:
                        'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.REJECT.TITLE',
                };
            } else {
                return {
                    title: 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.APPROVAL.TITLE',
                    message:
                        'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.APPROVAL.TITLE',
                };
            }
        } else if (item?.canTreat) {
            return {
                title: 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.TREATMENT.TITLE',
                message:
                    'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.TREATMENT.TITLE',
            };
        } else if (item?.canBeFinalized) {
            return {
                title: 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.FINALIZE.TITLE',
                message:
                    'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.FINALIZE.TITLE',
            };
        }
        return { title: '', message: '' };
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }
}
