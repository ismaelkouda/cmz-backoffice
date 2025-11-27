import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    inject,
    input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
    ɵFormGroupRawValue,
    ɵTypedOrUntyped,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AllFacade as finalizationAllFacade } from '@presentation/pages/finalization/application/all.facade';
import { QueuesFacade as finalizationQueuesFacade } from '@presentation/pages/finalization/application/queues.facade';
import { TasksFacade as finalizationTasksFacade } from '@presentation/pages/finalization/application/tasks.facade';
import { AllFacade as requestAllFacade } from '@presentation/pages/report-requests/application/all.facade';
import { QueuesFacade as requestsQueuesFacade } from '@presentation/pages/report-requests/application/queues.facade';
import { TasksFacade as requestTasksFacade } from '@presentation/pages/report-requests/application/tasks.facade';
import { AllFacade as processingAllFacade } from '@presentation/pages/reports-processing/application/all.facade';
import { QueuesFacade as processingQueuesFacade } from '@presentation/pages/reports-processing/application/queues.facade';
import { TasksFacade as processingTasksFacade } from '@presentation/pages/reports-processing/application/tasks.facade';
import { ImageZoomComponent } from '@shared/components/image-zoom/image-zoom.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { PriorityLevel } from '@shared/domain/enums/priority-level.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { ReportLocation } from '@shared/domain/interfaces/report-location.interface';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { DetailsFacade } from '../../application/details.facade';
import { FinalizeFacade } from '../../application/finalize.facade';
import { ManagementFacade } from '../../application/management.facade';
import { TreatmentFacade } from '../../application/treatment.facade';
import {
    DetailsEntity,
    ReportStatus,
} from '../../domain/entities/details/details.entity';
import { ManagementFormControlEntity } from '../../domain/entities/management/management-form-control.entity';
import { ManagementEntity } from '../../domain/entities/management/management.entity';
import { RouteContextService } from '../../domain/services/route-context.service';
import { MapManagementComponent } from '../../feature/management/map-management/map-management.component';
import { NewspapersComponent } from '../../feature/management/newspapers/newspapers.component';
type TreaterTimestampKey =
    | 'createdAt'
    | 'approvedAt'
    | 'acknowledgedAt'
    | 'rejectedAt'
    | 'confirmedAt'
    | 'abandonedAt'
    | 'finalizedAt';

type CategoryKey = 'information' | 'photos' | 'geographicView' | 'eventLogs';

interface WorkflowStep {
    key: TreaterTimestampKey;
    key1?: TreaterTimestampKey;
    key2?: TreaterTimestampKey;
    key3?: TreaterTimestampKey;
    label?: string;
    timestamp?: string | null;
}

interface Categories {
    key: CategoryKey;
    label: string;
}

interface InfoCard {
    type: string;
    title: string;
    icon: string;
}

@Component({
    selector: 'app-management',
    standalone: true,
    templateUrl: './management.component.html',
    styleUrls: ['./management.component.scss'],
    imports: [
        CommonModule,
        TranslateModule,
        ButtonModule,
        DialogModule,
        TranslateModule,
        AsyncPipe,
        SkeletonModule,
        TooltipModule,
        SelectModule,
        ReactiveFormsModule,
        MapManagementComponent,
        TagModule,
        ImageZoomComponent,
        NewspapersComponent,
    ],
    providers: [MessageService, RouteContextService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementComponent implements OnInit, OnDestroy {
    public readonly visible = input<boolean>(false);
    @Input() reportId!: string;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() closed = new EventEmitter<void>();
    public formTreatment!: FormGroup<ManagementFormControlEntity>;
    public isSubmitting$!: Observable<boolean>;
    public details$!: Observable<DetailsEntity>;
    public isLoading$!: Observable<boolean>;

    public selectedCategoryIndex: number = 0;
    public selectedSectionIndex: number = 0;

    public workflowSteps: WorkflowStep[] = [
        {
            key: 'createdAt',
            label: 'MANAGEMENT.STATUS.SUBMISSION',
            timestamp: null,
        },
        {
            key: 'acknowledgedAt',
            label: 'MANAGEMENT.STATUS.QUALIFICATION',
            timestamp: null,
        },
        {
            key: 'approvedAt',
            key1: 'rejectedAt',
            key2: 'confirmedAt',
            key3: 'abandonedAt',
            label: 'MANAGEMENT.STATUS.TREATMENT',
            timestamp: null,
        },
        {
            key: 'finalizedAt',
            label: 'MANAGEMENT.STATUS.FINALIZATION',
            timestamp: null,
        },
    ];

    public categories: any[] = [];

    public readonly motifOptions = [
        { code: 'DUP', label: '[DUP] - Signalement en doublon' },
        { code: 'HOP', label: '[HOP] - Signalement hors périmètre' },
        { code: 'IFM', label: '[IFM] - Informations incomplètes' },
        { code: 'FAS', label: '[FAS] - Faux signalement' },
        { code: 'AUT', label: '[AUT] - Autre raison' },
    ];

    private readonly toastService = inject(ToastrService);
    private readonly translate = inject(TranslateService);
    private readonly route = inject(ActivatedRoute);
    private readonly detailsFacade = inject(DetailsFacade);
    private readonly managementFacade = inject(ManagementFacade);
    private readonly fb = inject(FormBuilder);
    private readonly messageService = inject(MessageService);
    private readonly requestsQueuesFacade = inject(requestsQueuesFacade);
    private readonly requestsTasksFacade = inject(requestTasksFacade);
    private readonly requestsAllFacade = inject(requestAllFacade);
    private readonly processingQueuesFacade = inject(processingQueuesFacade);
    private readonly processingTasksFacade = inject(processingTasksFacade);
    private readonly processingAllFacade = inject(processingAllFacade);
    private readonly finalizationQueuesFacade = inject(
        finalizationQueuesFacade
    );
    private readonly finalizationTasksFacade = inject(finalizationTasksFacade);
    private readonly finalizationAllFacade = inject(finalizationAllFacade);
    private readonly finalizeFacade = inject(FinalizeFacade);
    private readonly queueFacade = inject(processingQueuesFacade);
    private readonly treatmentFacade = inject(TreatmentFacade);
    private readonly routeContextService = inject(RouteContextService);
    private readonly clipboardService = inject(ClipboardService);

    readonly details = toSignal(this.detailsFacade.details$, {
        initialValue: null,
    });
    readonly loading = toSignal(this.detailsFacade.loadingDetails$, {
        initialValue: false,
    });

    private readonly destroy$ = new Subject<void>();

    public isTreatmentFormExpanded = true;
    public endPointType!: EndPointType;

    ngOnInit(): void {
        this.initializeComponent();
        this.getUrlParams();
        this.subscribeToData();
        this.initializeWorkflowSteps();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeComponent(): void {
        this.initForm();
    }

    private getUrlParams(): void {
        this.endPointType =
            this.routeContextService.currentEndPointType() ?? 'requests';
        this.loadDetailsData(this.reportId, this.endPointType);
    }

    private getCategories(details: DetailsEntity): void {
        this.categories = [
            {
                key: 'information',
                label: 'MANAGEMENT.TABS.CATEGORIES.INFORMATION',
            },
            {
                key: 'photos',
                label: 'MANAGEMENT.TABS.CATEGORIES.PHOTOS',
            },
            {
                key: 'geographicView',
                label: 'MANAGEMENT.TABS.CATEGORIES.GEOGRAPHIC_VIEW',
            },
            ...(details.inProcessing || details.inFinalization
                ? [
                      {
                          key: 'eventLogs',
                          label: 'MANAGEMENT.TABS.CATEGORIES.TREATMENT_LOGS',
                      },
                  ]
                : []),
        ];
    }

    private loadDetailsData(
        reportId: string,
        endPointType: EndPointType
    ): void {
        this.detailsFacade.fetchDetails(reportId, endPointType);
    }

    private initializeWorkflowSteps(): void {
        this.details$.subscribe((details) => {
            if (details) {
                this.updateWorkflowTimestamps(details);
                this.getCategories(details);
            }
        });
    }

    private updateWorkflowTimestamps(details: DetailsEntity): void {
        this.workflowSteps = this.workflowSteps.map((step) => {
            let timestamp: string | null = null;
            const treater = details.treater;

            if (!treater) {
                return { ...step, timestamp };
            }

            if (
                step.key === 'approvedAt' &&
                step.key1 &&
                step.key2 &&
                step.key3
            ) {
                switch (details.status) {
                    case 'approved':
                        timestamp = treater[step.key];
                        break;
                    case 'rejected':
                        timestamp = treater[step.key1];
                        break;
                    case 'confirmed':
                        timestamp = treater[step.key2];
                        break;
                    case 'abandoned':
                        timestamp = treater[step.key3];
                        break;
                    default:
                        const keys: TreaterTimestampKey[] = [
                            step.key,
                            step.key1,
                            step.key2,
                            step.key3,
                        ];
                        for (const key of keys) {
                            if (key && treater[key]) {
                                timestamp = treater[key];
                                break;
                            }
                        }
                }
            } else {
                timestamp = treater[step.key];
            }

            return { ...step, timestamp };
        });
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

    public getToggleButtonLabel(): string {
        return this.isTreatmentFormExpanded
            ? 'MANAGEMENT.FORM.ACTIONS.HIDE_FORM'
            : 'MANAGEMENT.FORM.ACTIONS.SHOW_FORM';
    }

    public openTreatmentForm(): void {
        this.isTreatmentFormExpanded = true;
        this.markFormAsTouched();
    }

    public closeTreatmentForm(): void {
        this.isTreatmentFormExpanded = false;
    }

    private subscribeToData(): void {
        this.details$ = this.detailsFacade.details$;
        this.isLoading$ = this.detailsFacade.isLoading$;
        this.isSubmitting$ = this.managementFacade.loading$;
    }

    private initForm(): void {
        this.formTreatment = this.fb.group<ManagementFormControlEntity>({
            decision: new FormControl<string>('', {
                nonNullable: true,
            }),
            comment: new FormControl<string>('', {
                nonNullable: true,
            }),
            reason: new FormControl<string>('', {
                nonNullable: true,
            }),
            uniqId: new FormControl<string>(this.reportId, {
                nonNullable: true,
            }),
        });
        this.setupConditionalValidationsTake();
    }

    private setupConditionalValidationsTake(): void {
        this.formTreatment
            .get('decision')
            ?.valueChanges.subscribe((decision) => {
                const reasonControl = this.formTreatment.get('reason');
                const commentControl = this.formTreatment.get('comment');

                if (decision === 'rejected') {
                    reasonControl?.setValidators([Validators.required]);
                    commentControl?.clearValidators();
                } else {
                    reasonControl?.clearValidators();
                    commentControl?.clearValidators();
                }
                reasonControl?.updateValueAndValidity();
                commentControl?.updateValueAndValidity();
            });
    }

    public navigateToStep(step: WorkflowStep): void {
        console.log('Navigation vers:', step.key);
    }

    public getStepIcon(step: WorkflowStep): string {
        const iconMap: Record<string, string> = {
            PRISE_EN_CHARGE: 'pi pi-user-plus',
            APPROBATION: 'pi pi-check-circle',
            TREATMENT: 'pi pi-cog',
            FINALIZATION: 'pi pi-flag',
            EVALUATION: 'pi pi-star',
        };
        return iconMap[step.key] || 'pi pi-circle';
    }

    public getReportType(details: DetailsEntity | null): string {
        if (!details?.reportType) return 'MANAGEMENT.FORM.NOT_SPECIFIED';
        return this.getReportTypeLabel(details.reportType);
    }

    public getStatusText(details: DetailsEntity | null): string {
        if (!details?.status) return 'MANAGEMENT.FORM.NOT_SPECIFIED';
        return this.getStatusLabel(details.status);
    }

    public getOperators(details: DetailsEntity | null): TelecomOperator[] {
        return details?.operators || [];
    }

    public getCoordinates(details: DetailsEntity | null): string {
        if (!details?.location?.coordinates)
            return 'MANAGEMENT.FORM.NOT_SPECIFIED';
        const lat = details.location.coordinates.latitude?.toString() || 'N/A';
        const lng = details.location.coordinates.longitude?.toString() || 'N/A';
        return `${lat}, ${lng}`;
    }

    public getPriorityClass(details: DetailsEntity | null): string {
        if (!details) return 'priority-low';

        const priority = details.getPriorityLevel();
        const priorityMap: Record<PriorityLevel, string> = {
            [PriorityLevel.LOW]: 'priority-low',
            [PriorityLevel.MEDIUM]: 'priority-medium',
            [PriorityLevel.HIGH]: 'priority-high',
            [PriorityLevel.CRITICAL]: 'priority-high',
        };

        return priorityMap[priority] || 'priority-low';
    }

    public getPriorityText(details: DetailsEntity | null): string {
        if (!details) return 'MANAGEMENT.STATUS.PRIORITY_LOW';

        const priority = details.getPriorityLevel();
        const priorityMap: Record<PriorityLevel, string> = {
            [PriorityLevel.LOW]: 'MANAGEMENT.STATUS.PRIORITY_LOW',
            [PriorityLevel.MEDIUM]: 'MANAGEMENT.STATUS.PRIORITY_MEDIUM',
            [PriorityLevel.HIGH]: 'MANAGEMENT.STATUS.PRIORITY_HIGH',
            [PriorityLevel.CRITICAL]: 'MANAGEMENT.STATUS.PRIORITY_CRITICAL',
        };

        return priorityMap[priority] || 'MANAGEMENT.STATUS.PRIORITY_LOW';
    }

    public hasTabNotifications(categoryKey: string): boolean {
        return false;
    }

    public viewOnMap(): void {
        this.details$.subscribe((details) => {
            if (details?.location?.coordinates) {
                const { latitude, longitude } = details.location.coordinates;
                const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                window.open(mapUrl, '_blank');

                this.messageService.add({
                    severity: 'info',
                    summary: this.translate.instant(
                        'MANAGEMENT.ACTIONS.MAP_OPENED'
                    ),
                    detail: this.translate.instant(
                        'MANAGEMENT.ACTIONS.VIEWING_MAP'
                    ),
                });
            }
        });
    }

    public copyCoordinates(): void {
        this.details$.subscribe((details) => {
            const coords = this.getCoordinates(details);
            navigator.clipboard
                .writeText(coords)
                .then(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translate.instant(
                            'MANAGEMENT.ACTIONS.COORDINATES_COPIED'
                        ),
                        detail: this.translate.instant(
                            'MANAGEMENT.ACTIONS.COORDINATES_COPIED_DETAIL'
                        ),
                    });
                })
                .catch((err) => {
                    console.error('Erreur lors de la copie:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translate.instant(
                            'MANAGEMENT.ACTIONS.COPY_FAILED'
                        ),
                        detail: this.translate.instant(
                            'MANAGEMENT.ACTIONS.COPY_FAILED_DETAIL'
                        ),
                    });
                });
        });
    }

    copyToClipboard(value: string): void {
        this.clipboardService.copyFromContent(value);
        this.toastService.success(
            this.translate.instant('COPIED_TO_CLIPBOARD')
        );
    }

    public onValidReportTreatment(details: DetailsEntity): void {
        if (!this.reportId) {
            return;
        }
        if (!details.canBeTaken) {
            if (this.formTreatment.invalid) {
                this.markFormAsTouched();
                return;
            }
        }

        const management = details.managementPrams;
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(this.getSweetAlertTitle(management)),
            text: `${this.translate.instant(this.getSweetAlertMessage(management))} ${this.reportId}`,
            backdrop: false,
            confirmButtonText: this.translate.instant(
                this.getSweetAlertButton(management)
            ),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (
                result.isConfirmed &&
                this.formTreatment.valid &&
                this.reportId
            ) {
                const credentials: ɵTypedOrUntyped<
                    ManagementFormControlEntity,
                    ɵFormGroupRawValue<ManagementFormControlEntity>,
                    any
                > = this.formTreatment.getRawValue();
                this.executeManagementAction(management, credentials);
            }
        });
    }

    private executeManagementAction(
        management: string,
        credentials: ɵTypedOrUntyped<
            ManagementFormControlEntity,
            ɵFormGroupRawValue<ManagementFormControlEntity>,
            any
        >
    ): void {
        const action = this.handleManagementAction(management, credentials);
        if (action) {
            action().subscribe({
                next: (response) => {
                    if (!response.error && response.message) {
                        this.toastService.success(response.message);
                        this.onHide();
                        this.handleRefresh(management);
                    } else {
                        this.toastService.error(response.message);
                    }
                },
            });
        } else {
            console.error(`Unknown management action: ${management}`);
        }
    }

    private handleManagementAction(
        management: string,
        credentials: ɵTypedOrUntyped<
            ManagementFormControlEntity,
            ɵFormGroupRawValue<ManagementFormControlEntity>,
            any
        >
    ): () => Observable<ManagementEntity> {
        const actionMap: Record<string, () => Observable<ManagementEntity>> = {
            take: () =>
                this.managementFacade.take(credentials, this.endPointType),
            approve: () => {
                const decision = this.formTreatment.get('decision')?.value;
                if (decision === 'rejected') {
                    return this.managementFacade.reject(
                        credentials,
                        this.endPointType
                    );
                } else {
                    return this.managementFacade.approve(
                        credentials,
                        this.endPointType
                    );
                }
            },
            treat: () => this.managementFacade.process(credentials),
            finalize: () => this.managementFacade.finalize(credentials),
        };

        return actionMap[management];
    }

    private handleRefresh(management: string): void {
        const actionMap: Record<string, () => void> = {
            take: () => {
                switch (this.endPointType) {
                    case 'requests':
                        this.requestsQueuesFacade.refresh();
                        this.requestsTasksFacade.refresh();
                        break;

                    case 'reports-processing':
                        this.processingQueuesFacade.refresh();
                        this.processingTasksFacade.refresh();
                        break;

                    case 'reports-finalization':
                        this.finalizationQueuesFacade.refresh();
                        this.finalizationTasksFacade.refresh();
                        break;
                }
            },
            approve: () => {
                switch (this.endPointType) {
                    case 'requests':
                        this.requestsTasksFacade.refresh();
                        this.requestsAllFacade.refresh();
                        break;

                    case 'reports-processing':
                        this.processingTasksFacade.refresh();
                        this.processingAllFacade.refresh();
                        break;

                    case 'reports-finalization':
                        this.finalizationQueuesFacade.refresh();
                        this.finalizationAllFacade.refresh();
                        break;
                }
            },
            treat: () => {
                this.processingTasksFacade.refresh();
                this.processingAllFacade.refresh();
            },
            finalize: () => {
                this.finalizationTasksFacade.refresh();
                this.finalizationAllFacade.refresh();
            },
        };
        actionMap[management]();
    }

    public setDecision(decision: string): void {
        this.formTreatment.patchValue({
            decision: decision,
        });
        if (decision === 'accepted') {
            this.formTreatment.patchValue({
                reason: '',
            });
        }
        this.formTreatment.get('decision')?.markAsTouched();
    }

    private markFormAsTouched(): void {
        for (const control of Object.values(this.formTreatment.controls)) {
            control.markAsTouched();
        }
    }

    private getSweetAlertTitle(management: string): string {
        if (management === 'take') {
            return 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.WAITING.TITLE';
        } else if (management === 'approve') {
            const decision = this.formTreatment.get('decision')?.value;
            if (decision === 'reject') {
                return 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.REJECT.TITLE';
            } else {
                return 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.APPROVAL.TITLE';
            }
        } else if (management === 'treat') {
            return 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.TREATMENT.TITLE';
        } else if (management === 'finalize') {
            return 'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.FINALIZE.TITLE';
        } else return '';
    }

    private getSweetAlertMessage(management: string): string {
        let title: string;
        if (management === 'take') {
            return 'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.WAITING.TITLE';
        } else if (management === 'approve') {
            const decision = this.formTreatment.get('decision')?.value;
            if (decision === 'reject') {
                return 'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.REJECT.TITLE';
            } else {
                return 'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.APPROVAL.TITLE';
            }
        } else if (management === 'treat') {
            return 'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.TREATMENT.TITLE';
        } else if (management === 'finalize') {
            return 'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.FINALIZE.TITLE';
        } else return '';
    }

    private getSweetAlertButton(management: string): string {
        let title: string;
        if (management === 'take') {
            return 'MANAGEMENT.SWEET_ALERT_PARAMS.BUTTONS.WAITING.TITLE';
        } else if (management === 'approve') {
            const decision = this.formTreatment.get('decision')?.value;
            if (decision === 'rejected') {
                return 'MANAGEMENT.SWEET_ALERT_PARAMS.BUTTONS.REJECT.TITLE';
            } else {
                return 'MANAGEMENT.SWEET_ALERT_PARAMS.BUTTONS.APPROVAL.TITLE';
            }
        } else if (management === 'treat') {
            return 'MANAGEMENT.SWEET_ALERT_PARAMS.BUTTONS.TREATMENT.TITLE';
        } else if (management === 'finalize') {
            return 'MANAGEMENT.SWEET_ALERT_PARAMS.BUTTONS.FINALIZE.TITLE';
        } else return '';
    }

    trackByTab(_: number, tab: Categories): string {
        return tab.key;
    }

    public selectCategory(index: number): void {
        this.selectedCategoryIndex = index;
        this.selectedSectionIndex = 0;
    }

    public onHide(): void {
        this.visibleChange.emit(false);
        this.closed.emit();
    }

    getCategoryIcon(categoryKey: string): string {
        const iconMap: Record<string, string> = {
            information: 'pi pi-info-circle',
            photos: 'pi pi-images',
            geographicView: 'pi pi-map-marker',
            eventLogs: 'pi pi-calendar',
        };
        return iconMap[categoryKey] || 'pi pi-circle';
    }

    getReportTypeClass(reportType: ReportType | undefined): string {
        if (!reportType) return 'type-default';

        const typeClassMap: Record<ReportType, string> = {
            [ReportType.ABI]: 'type-urgent',
            [ReportType.ZOB]: 'type-normal',
            [ReportType.CPS]: 'type-urgent',
            [ReportType.CPO]: 'type-normal',
            [ReportType.OTHER]: 'type-default',
        };

        return typeClassMap[reportType] || 'type-default';
    }

    getReportTypeLabel(reportType: ReportType | undefined): string {
        if (!reportType) return 'MANAGEMENT.FORM.NOT_SPECIFIED';

        const labelMap: Record<ReportType, string> = {
            [ReportType.ABI]: 'MANAGEMENT.FORM.VALUES.REPORT_TYPE.ABI',
            [ReportType.ZOB]: 'MANAGEMENT.FORM.VALUES.REPORT_TYPE.ZOB',
            [ReportType.CPS]: 'MANAGEMENT.FORM.VALUES.REPORT_TYPE.ABI',
            [ReportType.CPO]: 'MANAGEMENT.FORM.VALUES.REPORT_TYPE.ZOB',
            [ReportType.OTHER]: 'MANAGEMENT.FORM.VALUES.REPORT_TYPE.OTHER',
        };

        return labelMap[reportType] || 'MANAGEMENT.FORM.NOT_SPECIFIED';
    }

    public getOperatorLabel(operator: string): string {
        const normalized = operator?.toLowerCase().trim() ?? '';
        let translationKey = '';

        switch (normalized) {
            case 'orange':
                translationKey =
                    'REPORTS_REQUESTS.QUEUES.OPTIONS.OPERATOR.ORANGE';
                break;
            case 'mtn':
                translationKey = 'REPORTS_REQUESTS.QUEUES.OPTIONS.OPERATOR.MTN';
                break;
            case 'moov':
                translationKey =
                    'REPORTS_REQUESTS.QUEUES.OPTIONS.OPERATOR.MOOV';
                break;
            default:
                return operator;
        }

        return this.translate.instant(translationKey);
    }

    public getOperatorTagStyle(operator: string): Record<string, string> {
        const normalized = operator?.toLowerCase().trim() ?? '';
        const backgroundColor = this.getOperatorColor(operator);
        const textColor = normalized === 'mtn' ? '#212121' : '#ffffff';

        return {
            backgroundColor,
            color: textColor,
        };
    }

    public getOperatorColor(operator: string): string {
        const normalized = operator?.toLowerCase().trim() ?? '';
        switch (normalized) {
            case 'orange':
                return 'rgb(241, 110, 0)';
            case 'mtn':
                return 'rgb(255, 203, 5)';
            case 'moov':
                return 'rgb(0, 91, 164)';
            default:
                return `rgba(var(--theme-default-rgb), 0.8)`;
        }
    }

    getStatusClass(status: ReportStatus | undefined): string {
        if (!status) return 'status-default';

        const statusClassMap: Record<ReportStatus, string> = {
            [ReportStatus.PENDING]: 'status-pending',
            [ReportStatus.FINALIZATION]: 'status-pending',
            [ReportStatus.APPROVED]: 'status-completed',
            [ReportStatus.REJECTED]: 'status-rejected',
            [ReportStatus.ABANDONED]: 'status-closed',
            [ReportStatus.CONFIRM]: 'status-confirmed',
            [ReportStatus.TERMINATED]: 'status-terminated',
            [ReportStatus['IN-PROGRESS']]: 'status-in-progress',
            [ReportStatus.PROCESSING]: 'status-in-progress',
        };

        return statusClassMap[status] || 'status-default';
    }

    getStatusLabel(status: ReportStatus | undefined): string {
        if (!status) return 'MANAGEMENT.FORM.NOT_SPECIFIED';

        const labelMap: Record<ReportStatus, string> = {
            [ReportStatus.PROCESSING]:
                'MANAGEMENT.FORM.VALUES.STATUS.PROCESSING',
            [ReportStatus.FINALIZATION]:
                'MANAGEMENT.FORM.VALUES.STATUS.FINALIZATION',
            [ReportStatus.PENDING]: 'MANAGEMENT.FORM.VALUES.STATUS.PENDING',
            [ReportStatus.APPROVED]: 'MANAGEMENT.FORM.VALUES.STATUS.APPROVED',
            [ReportStatus.REJECTED]: 'MANAGEMENT.FORM.VALUES.STATUS.REJECTED',
            [ReportStatus.ABANDONED]: 'MANAGEMENT.FORM.VALUES.STATUS.ABANDONED',
            [ReportStatus.CONFIRM]: 'MANAGEMENT.FORM.VALUES.STATUS.CONFIRM',
            [ReportStatus.TERMINATED]:
                'MANAGEMENT.FORM.VALUES.STATUS.TERMINATED',
            [ReportStatus['IN-PROGRESS']]:
                'MANAGEMENT.FORM.VALUES.STATUS.IN_PROGRESS',
        };

        return labelMap[status] || 'MANAGEMENT.FORM.NOT_SPECIFIED';
    }

    getRegionFromLocation(location: ReportLocation | undefined): string {
        if (!location?.name) return 'MANAGEMENT.FORM.NOT_SPECIFIED';
        return (
            location.name.split(',')[0]?.trim() ||
            'MANAGEMENT.FORM.NOT_SPECIFIED'
        );
    }

    getDepartmentFromLocation(location: ReportLocation | undefined): string {
        if (!location?.name) return 'MANAGEMENT.FORM.NOT_SPECIFIED';
        return (
            location.name.split(',')[1]?.trim() ||
            'MANAGEMENT.FORM.NOT_SPECIFIED'
        );
    }

    getCommuneFromLocation(location: ReportLocation | undefined): string {
        if (!location?.name) return 'MANAGEMENT.FORM.NOT_SPECIFIED';
        return (
            location.name.split(',')[2]?.trim() ||
            'MANAGEMENT.FORM.NOT_SPECIFIED'
        );
    }
}
