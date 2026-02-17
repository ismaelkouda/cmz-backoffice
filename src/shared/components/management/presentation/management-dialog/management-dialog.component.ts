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
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';

import {
    enumToFilterOptions,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { TABS } from '@shared/components/management/domain/constants/management-tabs.contant';
import { ManagementFormControl } from '@shared/components/management/domain/controls/management-form-control';
import { Motifs } from '@shared/components/management/domain/enums/management-motif.enum';
import { RouteContextService } from '@shared/components/management/domain/services/management-route-context.service';
import { ManagementInfoPanelComponent } from '@shared/components/management/presentation/management-info-panel/management-info-panel.component';
import { ManagementMapComponent } from '@shared/components/management/presentation/management-map/management-map.component';
import { ManagementTreatmentFormComponent } from '@shared/components/management/presentation/management-treatment-form/management-treatment-form.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { operatorsTagStyle } from '@shared/domain/functions/operators-tag-style.function';

import { DetailsFacade as FinalizationFacade } from '@presentation/pages/finalization/application/services/details/details.facade';
import { DetailsFacade as ProcessingFacade } from '@presentation/pages/processing/application/services/details/details.facade';
import { DetailsFacade as RequestsFacade } from '@presentation/pages/requests/application/services/details/details.facade';

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
        TranslateModule,
        SkeletonModule,
        TooltipModule,
        SelectModule,
        ReactiveFormsModule,
        ManagementMapComponent,
        ManagementInfoPanelComponent,
        ManagementTreatmentFormComponent,
        TagModule,
    ],
    providers: [MessageService, RouteContextService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementDialogComponent implements OnInit, OnDestroy {
    private readonly toastService = inject(ToastrService);
    private readonly translate = inject(TranslateService);
    private readonly route = inject(ActivatedRoute);
    private readonly requestsFacade = inject(RequestsFacade);
    private readonly processingFacade = inject(ProcessingFacade);
    private readonly finalizationFacade = inject(FinalizationFacade);
    private readonly fb = inject(FormBuilder);
    private readonly routeContextService = inject(RouteContextService);
    private readonly clipboardService = inject(ClipboardService);
    public readonly visible = input.required<boolean>();
    public readonly uniqId = input.required<string>();
    public readonly visibleChange = output<boolean>();
    public readonly closed = output();

    public selectedTabIndex = 0;
    public isTreatmentFormExpanded = true;
    public readonly TABS = TABS;
    private lastRequestsSuccess = this.requestsFacade.actionSuccess();
    private lastProcessingSuccess = this.processingFacade.actionSuccess();
    private lastFinalizationSuccess = this.finalizationFacade.actionSuccess();

    public readonly itemsRequests = toSignal(this.requestsFacade.items$, {
        initialValue: null,
    });
    readonly loadingReports = toSignal(this.requestsFacade.isLoading$, {
        initialValue: false,
    });

    public readonly itemsProcessing = toSignal(this.processingFacade.items$, {
        initialValue: null,
    });
    readonly loadingProcessing = toSignal(this.processingFacade.isLoading$, {
        initialValue: false,
    });

    public readonly itemsFinalization = toSignal(
        this.finalizationFacade.items$,
        {
            initialValue: null,
        }
    );
    readonly loadingFinalization = toSignal(
        this.finalizationFacade.isLoading$,
        {
            initialValue: false,
        }
    );

    private readonly destroy$ = new Subject<void>();
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

    private readonly patchRequestsForm = effect(() => {
        const item = this.itemsRequests();
        if (item && Object.keys(item).length > 0) {
            const decisionControl = this.form.get('decision');
            const reasonControl = this.form.get('reason');
            const commentControl = this.form.get('comment');
            if (item.canBeApproved) {
                decisionControl?.setValidators([Validators.required]);
                decisionControl?.valueChanges
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((decision) => {
                        if (decision === 'rejected') {
                            reasonControl?.setValidators([Validators.required]);
                            commentControl?.setValidators([
                                Validators.required,
                            ]);
                        } else {
                            reasonControl?.clearValidators();
                            commentControl?.clearValidators();
                        }
                        reasonControl?.updateValueAndValidity();
                        commentControl?.updateValueAndValidity();
                    });
            }
        }
    });

    private readonly patchProcessingFrom = effect(() => {
        const item = this.itemsProcessing();
        if (item && Object.keys(item).length > 0) {
            const commentControl = this.form.get('comment');
            if (item.canBeTreated) {
                commentControl?.setValidators([Validators.required]);
            }
        }
    });

    private readonly patchFinalizationForm = effect(() => {
        const item = this.itemsFinalization();
        if (item && Object.keys(item).length > 0) {
            const commentControl = this.form.get('comment');
            if (item.canBeFinalized) {
                commentControl?.setValidators([Validators.required]);
            }
        }
    });

    private readonly stateRequestsFormEffect = effect(() => {
        const state = this.requestsFacade.actionState();
        if (state === 'loading') {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }
    });

    private readonly stateRequestsFormSuccessEffect = effect(() => {
        const current = this.requestsFacade.actionSuccess();
        if (current === this.lastRequestsSuccess) {
            return;
        }
        this.lastRequestsSuccess = current;
        this.onCloseDialog();
    });

    private readonly stateProcessingFormEffect = effect(() => {
        const state = this.processingFacade.actionState();
        if (state === 'loading') {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }
    });

    private readonly stateProcessingFormSuccessEffect = effect(() => {
        const current = this.processingFacade.actionSuccess();
        if (current === this.lastProcessingSuccess) {
            return;
        }
        this.lastProcessingSuccess = current;
        this.onCloseDialog();
    });

    private readonly stateFinalizationFormEffect = effect(() => {
        const state = this.finalizationFacade.actionState();
        if (state === 'loading') {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }
    });

    private readonly stateFinalizationFormSuccessEffect = effect(() => {
        const current = this.finalizationFacade.actionSuccess();
        if (current === this.lastFinalizationSuccess) {
            return;
        }
        this.lastFinalizationSuccess = current;
        this.onCloseDialog();
    });

    ngOnInit(): void {
        const dto = { uniqId: this.uniqId() };
        if (this.routeContextService.isRequestsModule()) {
            this.requestsFacade.read(dto);
        } else if (this.routeContextService.isReportsProcessingModule()) {
            this.processingFacade.read(dto);
        } else if (this.routeContextService.isReportsFinalizationModule()) {
            this.finalizationFacade.read(dto);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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
        if (!this.uniqId()) {
            return;
        }
        if (
            !this.itemsRequests()?.canBeTaken ||
            !this.itemsProcessing()?.canBeTaken ||
            !this.itemsFinalization()?.canBeTaken
        ) {
            if (this.form.invalid) {
                this.markFormAsTouched();
                return;
            }
        }

        const { title, message } = this.getSweetAlertLabels();

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(title),
            text: `${this.t(message)} ${this.uniqId()}`,
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed && this.form.valid && this.uniqId()) {
                this.executeManagementAction();
            }
        });
    }

    private executeManagementAction(): void {
        // const actionMap: Record<DetailsPermissions, () => void> = {
        //     take: () => {
        //         if (this.routeContextService.isRequestsModule()) {
        //             this.reportFacade.take({
        //                 uniqId: this.uniqId(),
        //             });
        //         } else if (
        //             this.routeContextService.isReportsProcessingModule()
        //         ) {
        //         } else if (
        //             this.routeContextService.isReportsFinalizationModule()
        //         ) {
        //         }
        //     },
        //     approve: () => {
        //         const decision = this.form.get('decision')?.value;
        //         if (decision === 'rejected') {
        //             this.reportFacade.approve();
        //         } else {
        //             this.reportFacade.reject();
        //         }
        //     },
        //     treat: () =>
        //         this.reportFacade.treat({
        //             uniqId: this.uniqId(),
        //             comment: this.form.value.comment ?? '',
        //         }),
        //     finalize: () => this.managementFacade.finalize(),
        //     see: () => of(),
        // };
        // actionMap[this.items()?.permissions ?? 'see'];
    }

    public setDecision(decision: string): void {
        this.form.patchValue({
            decision: decision,
        });
        if (decision === 'accepted') {
            this.form.patchValue({
                reason: '',
            });
        }
        this.form.get('decision')?.markAsTouched();
    }

    private markFormAsTouched(): void {
        for (const control of Object.values(this.form.controls)) {
            control.markAsTouched();
        }
    }

    private getSweetAlertLabels(): { title: string; message: string } {
        if (
            this.itemsRequests()?.canBeTaken ||
            this.itemsProcessing()?.canBeTaken ||
            this.itemsFinalization()?.canBeTaken
        ) {
            return {
                title: 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.WAITING.TITLE',
                message: 'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.WAITING.TITLE',
            };
        } else if (this.itemsRequests()?.canBeApproved) {
            const decision = this.form.get('decision')?.value;
            if (decision === 'reject') {
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
        } else if (this.itemsProcessing()?.canBeTreated) {
            return {
                title: 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.TREATMENT.TITLE',
                message:
                    'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.TREATMENT.TITLE',
            };
        } else if (this.itemsFinalization()?.canBeFinalized) {
            return {
                title: 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.FINALIZE.TITLE',
                message:
                    'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.FINALIZE.TITLE',
            };
        } else {
            return { title: '', message: '' };
        }
    }

    trackByTab(_: number, tab: string): string {
        return tab;
    }

    public selectTab(index: number): void {
        this.selectedTabIndex = index;
    }

    getOperatorTagStyle(operator: string): Record<string, string> {
        return operatorsTagStyle(operator);
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    public onCloseDialog(): void {
        SweetAlert.close();
        this.visibleChange.emit(false);
        this.closed.emit();
    }
}
