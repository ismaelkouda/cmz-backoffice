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
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DetailsEntity as FinalizationEntity } from '@pages/finalization/domain/entities/details/details.entity';
import { DetailsEntity as ProcessingEntity } from '@pages/processing/domain/entities/details/details.entity';
import { DetailsEntity as RequestsEntity } from '@pages/requests/domain/entities/details/details.entity';
import {
    enumToFilterOptions,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { TABS } from '@shared/components/management/domain/constants/management-tabs.contant';
import { ManagementFormControl } from '@shared/components/management/domain/controls/management-form-control';
import { Motifs } from '@shared/components/management/domain/enums/management-motif.enum';
import { ManagementStateService } from '@shared/components/management/domain/services/management-state.service';
import { ManagementValidationService } from '@shared/components/management/domain/services/management-validation.service';
import { ManagementHeaderComponent } from '@shared/components/management/presentation/management-header/management-header.component';
import { ManagementInfoPanelComponent } from '@shared/components/management/presentation/management-info-panel/management-info-panel.component';
import { ManagementMapComponent } from '@shared/components/management/presentation/management-map/management-map.component';
import { ManagementPhotosPanelComponent } from '@shared/components/management/presentation/management-photos-panel.component.html/management-photos-panel.component';
import { ManagementSidebarComponent } from '@shared/components/management/presentation/management-sidebar/management-sidebar.component';
import { ManagementTreatmentFormComponent } from '@shared/components/management/presentation/management-treatment-form/management-treatment-form.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
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
        ManagementPhotosPanelComponent,
        ManagementMapComponent,
        ManagementInfoPanelComponent,
        ManagementTreatmentFormComponent,
        TagModule,
    ],
    providers: [
        MessageService,
        ManagementValidationService,
        ManagementStateService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementDialogComponent implements OnInit, OnDestroy {
    private readonly toastService = inject(ToastrService);
    private readonly translate = inject(TranslateService);
    private readonly validationService = inject(ManagementValidationService);
    private readonly stateService = inject(ManagementStateService);
    private readonly fb = inject(FormBuilder);
    private readonly clipboardService = inject(ClipboardService);
    public readonly visible = input.required<boolean>();
    public readonly uniqId = input.required<string>();
    public readonly type = input.required<TypeReport>();
    public readonly visibleChange = output<boolean>();
    public readonly closed = output();

    public selectedTabIndex = 0;
    public isTreatmentFormExpanded = true;
    public readonly TABS = TABS;
    // private readonly context = computed<Partial<RouteContextType | null>>(
    //     () => {
    //         if (this.routeContextService.isRequestsModule()) {
    //             return 'requests';
    //         }
    //         if (this.routeContextService.isReportsProcessingModule()) {
    //             return 'reports-processing';
    //         }
    //         if (this.routeContextService.isReportsFinalizationModule()) {
    //             return 'reports-finalization';
    //         }
    //         return null;
    //     }
    // );
    public readonly items = this.stateService.items;
    public readonly loading = this.stateService.loading;
    public readonly actionState = this.stateService.actionState;
    public readonly submitting = computed(() => this.actionState());

    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    readonly motifOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Motifs, this.t.bind(this), 'toUpperCase');
    });

    readonly form = this.fb.group<ManagementFormControl>({
        decision: new FormControl<string>('', {
            nonNullable: true,
        }),
        comment: new FormControl<string>('', {
            nonNullable: true,
        }),
        reason: new FormControl<string>('', {
            nonNullable: true,
        }),
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

    private readonly successEffect = effect(() => {
        const success = this.stateService.actionSuccess();
        if (success) {
            this.onCloseDialog();
        }
    });

    ngOnInit(): void {
        this.stateService.initialize(this.type(), this.uniqId());
    }

    ngOnDestroy(): void {
        this.stateService.reset();
    }

    public toggleTreatmentForm(): void {
        this.isTreatmentFormExpanded = !this.isTreatmentFormExpanded;
        if (this.isTreatmentFormExpanded) {
            this.markFormAsTouched();
        }
    }

    public getToggleButtonIcon(): string {
        return this.isTreatmentFormExpanded
            ? 'pi pi-chevron-down'
            : 'pi pi-chevron-up';
    }

    public openTreatmentForm(): void {
        this.isTreatmentFormExpanded = true;
        this.markFormAsTouched();
    }

    public closeTreatmentForm(): void {
        this.isTreatmentFormExpanded = false;
    }

    copyToClipboard(value: string): void {
        this.clipboardService.copyFromContent(value);
        this.toastService.success(this.t('COMMON.COPIED_TO_CLIPBOARD'));
    }

    public onValidReportTreatment(): void {
        const items = this.items();

        if (!this.uniqId() || !items || !this.type()) {
            return;
        }

        // if (this.validationService.isTakeAction(items)) {
        //     this.executeAction('take', {});
        //     return;
        // }

        // if (
        //     !this.validationService.isFormValidForContext(
        //         this.form,
        //         context,
        //         items
        //     )
        // ) {
        //     this.markFormAsTouched();
        //     return;
        // }

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

    public setDecision(decision: string): void {
        this.form.patchValue({ decision });
        if (decision === 'accepted') {
            this.form.patchValue({ reason: '' });
        }
        this.form.get('decision')?.markAsTouched();
    }

    public selectTab(index: number): void {
        this.selectedTabIndex = index;
    }

    public onCloseDialog(): void {
        SweetAlert.close();
        this.visibleChange.emit(false);
        this.closed.emit();
        this.stateService.reset();
    }

    public getOperatorTagStyle(operator: string): Record<string, string> {
        return operatorsTagStyle(operator);
    }

    public trackByTab(_: number, tab: { value: string }): string {
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
        if (items?.canBeTaken) {
            return 'take';
        }
        if ((items as RequestsEntity).canBeApproved) {
            return this.form.get('decision')?.value === 'rejected'
                ? 'reject'
                : 'approve';
        }
        if ((items as ProcessingEntity).canBeTreated) {
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
        if (item?.canBeTaken) {
            return {
                title: 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.WAITING.TITLE',
                message: 'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.WAITING.TITLE',
            };
        } else if (item?.canBeApproved) {
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
        } else if (item?.canBeTreated) {
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
