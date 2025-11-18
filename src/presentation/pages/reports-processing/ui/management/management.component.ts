import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ɵFormGroupRawValue,
    ɵTypedOrUntyped,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApprovalFacade } from '@presentation/pages/report-requests/application/approval.facade';
import { WaitingFacade } from '@presentation/pages/report-requests/application/waiting.facade';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { DetailsFacade } from '../../application/details.facade';
import { FinalizeFacade } from '../../application/finalize.facade';
import { ManagementFacade } from '../../application/management.facade';
import { QueueFacade } from '../../application/queue.facade';
import { TreatmentFacade } from '../../application/treatment.facade';
import {
    DetailsEntity,
    PriorityLevel,
    ReportLocation,
    ReportStatus,
    ReportType,
    TelecomOperator,
} from '../../domain/entities/details/details.entity';
import { ManagementFormControlEntity } from '../../domain/entities/management/management-form-control.entity';
import { ManagementEntity } from '../../domain/entities/management/management.entity';

interface WorkflowStep {
    key: string;
    label: string;
    timestamp?: string | null;
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
    ],
    providers: [MessageService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementComponent implements OnInit {
    @Input() visible = false;
    @Input() reportId!: string;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() closed = new EventEmitter<void>();

    public formTreatment!: FormGroup<ManagementFormControlEntity>;
    public isSubmitting$!: Observable<boolean>;
    public details$!: Observable<DetailsEntity>;
    public isLoading$!: Observable<boolean>;

    public selectedCategoryIndex: number = 0;
    public selectedSectionIndex: number = 0;
    public rejectionComment: string = '';

    public infoCards: InfoCard[] = [
        {
            type: 'report-info',
            title: 'MANAGEMENT.SIDEBAR.REPORT_INFO.TITLE',
            icon: 'pi pi-info-circle',
        },
        {
            type: 'operators',
            title: 'MANAGEMENT.SIDEBAR.OPERATORS.TITLE',
            icon: 'pi pi-users',
        },
        {
            type: 'location',
            title: 'MANAGEMENT.SIDEBAR.LOCATION.TITLE',
            icon: 'pi pi-map-marker',
        },
    ];

    public workflowSteps: WorkflowStep[] = [
        {
            key: 'PRISE_EN_CHARGE',
            label: 'MANAGEMENT.STATUS.PRISE_EN_CHARGE',
            timestamp: null,
        },
        {
            key: 'APPROBATION',
            label: 'MANAGEMENT.STATUS.APPROBATION',
            timestamp: null,
        },
        {
            key: 'TREATMENT',
            label: 'MANAGEMENT.STATUS.TREATMENT',
            timestamp: null,
        },
        {
            key: 'FINALIZATION',
            label: 'MANAGEMENT.STATUS.FINALIZATION',
            timestamp: null,
        },
        {
            key: 'EVALUATION',
            label: 'MANAGEMENT.STATUS.EVALUATION',
            timestamp: null,
        },
    ];

    public readonly categories = [
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
    ];

    public readonly motifOptions = [
        { code: 'DUP', label: '[DUP] - Signalement en doublon' },
        { code: 'HOP', label: '[HOP] - Signalement hors périmètre' },
        { code: 'IFM', label: '[IFM] - Informations incomplètes' },
        { code: 'FAS', label: '[FAS] - Faux signalement' },
        { code: 'AUT', label: '[AUT] - Autre raison' },
    ];

    private readonly toastService = inject(ToastrService);
    private readonly translate = inject(TranslateService);
    private readonly fb = inject(FormBuilder);
    private readonly messageService = inject(MessageService);
    private readonly waitingFacade = inject(WaitingFacade);
    private readonly approvalFacade = inject(ApprovalFacade);
    private readonly finalizeFacade = inject(FinalizeFacade);
    private readonly queueFacade = inject(QueueFacade);
    private readonly treatmentFacade = inject(TreatmentFacade);
    private readonly destroy$ = new Subject<void>();

    public isTreatmentFormExpanded = false;

    constructor(
        private detailsFacade: DetailsFacade,
        private managementFacade: ManagementFacade
    ) {}

    ngOnInit(): void {
        this.initializeComponent();
        this.loadUserData();
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

    private initializeWorkflowSteps(): void {
        this.details$.subscribe((details) => {
            if (details) {
                this.updateWorkflowTimestamps(details);
            }
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

    private updateWorkflowTimestamps(details: DetailsEntity): void {
        this.workflowSteps = this.workflowSteps.map((step) => {
            let timestamp = null;

            switch (step.key) {
                case 'PRISE_EN_CHARGE':
                    timestamp = details.timestamps?.createdAt;
                    break;
                case 'APPROBATION':
                    timestamp = details.approval?.approvedAt;
                    break;
            }

            return { ...step, timestamp };
        });
    }

    private loadUserData(): void {
        this.detailsFacade.fetchDetails(this.reportId);
    }

    private subscribeToData(): void {
        this.details$ = this.detailsFacade.details$;
        this.isLoading$ = this.detailsFacade.isLoading$;
        this.isSubmitting$ = this.managementFacade.loading$;

        this.details$.subscribe((details) => {
            console.log(details);
        });
    }

    private initForm(): void {
        this.formTreatment = this.fb.group<ManagementFormControlEntity>({
            decision: new FormControl<string>('', { nonNullable: true }),
            comment: new FormControl<string>('', { nonNullable: true }),
            reason: new FormControl<string>('', { nonNullable: true }),
            uniqId: new FormControl<string>(this.reportId, {
                nonNullable: true,
            }),
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

    public onValidReportTreatment(details: DetailsEntity): void {
        if (!this.reportId) {
            return;
        }
        if (this.formTreatment.invalid) {
            this.markFormAsTouched();
            return;
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
            take: () => this.managementFacade.take(credentials),
            approve: () => {
                const decision = this.formTreatment.get('decision')?.value;
                if (decision === 'rejected') {
                    return this.managementFacade.reject(credentials);
                } else {
                    return this.managementFacade.approve(credentials);
                }
            },
            treat: () => this.managementFacade.process(credentials),
            //finalize: () => this.managementFacade.finalize(credentials),
        };

        return actionMap[management];
    }

    private handleRefresh(management: string): void {
        const actionMap: Record<string, () => void> = {
            take: () => this.waitingFacade.refresh(),
            approve: () => this.approvalFacade.refresh(),
            treat: () => this.treatmentFacade.refresh(),
        };
        actionMap[management]();
        console.log('manaement', management);
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
        let title: string;
        if (management === 'take') {
            return (title =
                'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.WAITING.TITLE');
        }
        if (management === 'approve') {
            const decision = this.formTreatment.get('decision')?.value;
            if (decision === 'reject') {
                return (title =
                    'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.REJECT.TITLE');
            } else {
                return (title =
                    'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.APPROVAL.TITLE');
            }
        } else return '';
        /* if (management.canBeTaken) {
        }
        if (management.canBeTaken) {
            return (title =
                'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.TREATMENT.TITLE');
        }
        if (management.canBeTaken) {
            return (title =
                'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.FINALIZE.TITLE');
        }
        if (management.canBeTaken) {
            return (title =
                'MANAGEMENT.SWEET_ALERT_PARAMS.CONFIRM.EVALUATE.TITLE');
        } */
    }

    private getSweetAlertMessage(management: string): string {
        let title: string;
        if (management === 'take') {
            return (title =
                'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.WAITING.TITLE');
        }
        if (management === 'approve') {
            const decision = this.formTreatment.get('decision')?.value;
            if (decision === 'reject') {
                return (title =
                    'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.REJECT.TITLE');
            } else {
                return (title =
                    'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.APPROVAL.TITLE');
            }
        } else return '';
        /* if (management.canBeTaken) {
        }
        if (management.canBeRejected) {
        }
        if (management.canBeTaken) {
            return (title =
                'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.TREATMENT.TITLE');
        }
        if (management.canBeTaken) {
            return (title =
                'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.FINALIZE.TITLE');
        }
        if (management.canBeTaken) {
            return (title =
                'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.EVALUATE.TITLE');
        } */
    }

    private getSweetAlertButton(management: string): string {
        let title: string;
        if (management === 'take') {
            return (title =
                'MANAGEMENT.SWEET_ALERT_PARAMS.BUTTONS.WAITING.TITLE');
        }
        if (management === 'approve') {
            const decision = this.formTreatment.get('decision')?.value;
            if (decision === 'reject') {
                return (title =
                    'MANAGEMENT.SWEET_ALERT_PARAMS.BUTTONS.REJECT.TITLE');
            } else {
                return (title =
                    'MANAGEMENT.SWEET_ALERT_PARAMS.MESSAGES.BUTTONS.TITLE');
            }
        } else return '';
        /* if (management.canBeTaken) {
            return (title =
                'MANAGEMENT.SWEET_ALERT_PARAMS.BUTTONS.TREATMENT.TITLE');
        }
        if (management.canBeTaken) {
            return (title =
                'MANAGEMENT.SWEET_ALERT_PARAMS.BUTTONS.FINALIZE.TITLE');
        }
        if (management.canBeTaken) {
            return (title =
                'MANAGEMENT.SWEET_ALERT_PARAMS.BUTTONS.EVALUATE.TITLE');
        } */
    }

    public selectCategory(index: number): void {
        this.selectedCategoryIndex = index;
        this.selectedSectionIndex = 0;
    }

    public onHide(): void {
        this.visible = false;
        this.visibleChange.emit(false);
        this.closed.emit();
    }

    getActionButtonLabel(details: DetailsEntity): string {
        console.log('azerrty', details);
        console.log('details.managementPrams', details.managementPrams);
        const management = details.managementPrams;
        const labelMap: Record<string, string> = {
            take: 'MANAGEMENT.FOOTER.ACTIONS.TAKE_CHARGE',
            approve: 'MANAGEMENT.FOOTER.ACTIONS.APPROVE',
            treat: 'MANAGEMENT.FOOTER.ACTIONS.PROCESS',
            finalize: 'MANAGEMENT.FOOTER.ACTIONS.FINALIZE',
            see: 'MANAGEMENT.FOOTER.ACTIONS.VIEW',
        };

        return labelMap[management] || 'SAVE';
    }

    getCategoryIcon(categoryKey: string): string {
        const iconMap: Record<string, string> = {
            information: 'pi pi-info-circle',
            photos: 'pi pi-images',
            geographicView: 'pi pi-map-marker',
        };
        return iconMap[categoryKey] || 'pi pi-circle';
    }

    getReportTypeClass(reportType: ReportType | undefined): string {
        if (!reportType) return 'type-default';

        const typeClassMap: Record<ReportType, string> = {
            [ReportType.ABI]: 'type-urgent',
            [ReportType.ZOB]: 'type-normal',
            [ReportType.OTHER]: 'type-default',
        };

        return typeClassMap[reportType] || 'type-default';
    }

    getReportTypeLabel(reportType: ReportType | undefined): string {
        if (!reportType) return 'MANAGEMENT.FORM.NOT_SPECIFIED';

        const labelMap: Record<ReportType, string> = {
            [ReportType.ABI]: 'MANAGEMENT.FORM.VALUES.REPORT_TYPE.ABI',
            [ReportType.ZOB]: 'MANAGEMENT.FORM.VALUES.REPORT_TYPE.ZOB',
            [ReportType.OTHER]: 'MANAGEMENT.FORM.VALUES.REPORT_TYPE.OTHER',
        };

        return labelMap[reportType] || 'MANAGEMENT.FORM.NOT_SPECIFIED';
    }

    getStatusClass(status: ReportStatus | undefined): string {
        if (!status) return 'status-default';

        const statusClassMap: Record<ReportStatus, string> = {
            [ReportStatus.PENDING]: 'status-pending',
            [ReportStatus.APPROVED]: 'status-completed',
            [ReportStatus.REJECTED]: 'status-rejected',
            [ReportStatus.ABANDONED]: 'status-closed',
            [ReportStatus.CONFIRM]: 'status-confirmed',
            [ReportStatus.TERMINATED]: 'status-terminated',
            [ReportStatus.RECEIVED]: 'status-received',
            [ReportStatus['IN-PROGRESS']]: 'status-in-progress',
        };

        return statusClassMap[status] || 'status-default';
    }

    getStatusLabel(status: ReportStatus | undefined): string {
        if (!status) return 'MANAGEMENT.FORM.NOT_SPECIFIED';

        const labelMap: Record<ReportStatus, string> = {
            [ReportStatus.PENDING]: 'MANAGEMENT.FORM.VALUES.STATUS.PENDING',
            [ReportStatus.APPROVED]: 'MANAGEMENT.FORM.VALUES.STATUS.APPROVED',
            [ReportStatus.REJECTED]: 'MANAGEMENT.FORM.VALUES.STATUS.REJECTED',
            [ReportStatus.ABANDONED]: 'MANAGEMENT.FORM.VALUES.STATUS.ABANDONED',
            [ReportStatus.CONFIRM]: 'MANAGEMENT.FORM.VALUES.STATUS.CONFIRM',
            [ReportStatus.TERMINATED]:
                'MANAGEMENT.FORM.VALUES.STATUS.TERMINATED',
            [ReportStatus.RECEIVED]: 'MANAGEMENT.FORM.VALUES.STATUS.RECEIVED',
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
