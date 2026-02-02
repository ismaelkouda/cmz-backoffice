import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    OnInit,
    Signal,
    untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map } from 'rxjs';
import SweetAlert from 'sweetalert2';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';

import { ParticipantsFindoneFacade } from '@presentation/pages/team-organization/application/services/participants/participants-findone.facade';
import { ParticipantsFacade } from '@presentation/pages/team-organization/application/services/participants/participants.facade';
import { RolesSelectFacade } from '@presentation/pages/team-organization/application/services/participants/roles-select.facade';
import { ParticipantsFormControl } from '@presentation/pages/team-organization/domain/controls/participants/participants-form.control';
import { ParticipantsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-findone.entity';
import { RolesSelectEntity } from '@presentation/pages/team-organization/domain/entities/participants/roles-select.entity';
import { FormValidators } from '@presentation/pages/team-organization/domain/validators/form-validators';

import { ParticipantsFormHelperService } from './participants-form-helper.service';
import { ParticipantsFormValidationService } from './participants-form-validation.service';

@Component({
    selector: 'app-participants-form',
    templateUrl: './participants-form.component.html',
    styleUrls: ['./participants-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ReactiveFormsModule,
        InputTextModule,
        InputMaskModule,
        TextareaModule,
        SelectModule,
        ButtonModule,
        TagModule,
        ToastModule,
        TooltipModule,
    ],
    providers: [
        MessageService,
        ParticipantsFormValidationService,
        ParticipantsFormHelperService,
        RolesSelectFacade,
        ParticipantsFindoneFacade,
        ParticipantsFacade,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsFormComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly participantsFacade = inject(ParticipantsFacade);
    private readonly rolesFacade = inject(RolesSelectFacade);
    private readonly findOneFacade = inject(ParticipantsFindoneFacade);
    private readonly translate = inject(TranslateService);
    private readonly messageService = inject(MessageService);
    private readonly validationService = inject(
        ParticipantsFormValidationService
    );
    private readonly helperService = inject(ParticipantsFormHelperService);

    readonly VALIDATION = FormValidators;

    readonly form: FormGroup<ParticipantsFormControl> =
        this.fb.nonNullable.group<ParticipantsFormControl>({
            firstName: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.FIRST_NAME.MIN),
                    Validators.maxLength(FormValidators.FIRST_NAME.MAX),
                    Validators.pattern(FormValidators.FIRST_NAME.PATTERN),
                ],
            }),
            lastName: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.LAST_NAME.MIN),
                    Validators.maxLength(FormValidators.LAST_NAME.MAX),
                    Validators.pattern(FormValidators.LAST_NAME.PATTERN),
                ],
            }),
            email: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.pattern(FormValidators.EMAIL.PATTERN),
                ],
            }),
            phone: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.PHONE.MIN),
                    Validators.maxLength(FormValidators.PHONE.MAX),
                    Validators.pattern(FormValidators.PHONE.PATTERN),
                ],
            }),
            role: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

    readonly roles = toSignal(this.rolesFacade.items$, {
        initialValue: [] as RolesSelectEntity[],
    });

    readonly currentParticipant = toSignal(this.findOneFacade.item$, {
        initialValue: null as unknown as ParticipantsFindOneEntity,
    });

    private readonly paramsUniqId: Signal<string> = toSignal(
        this.route.queryParams.pipe(
            map(
                (params: Record<string, unknown>) =>
                    (params['uniqId'] as string) || ''
            )
        ),
        { initialValue: '' }
    );

    readonly isEditMode = computed(() => !!this.paramsUniqId());

    private readonly handleRouteParamsChange = effect(
        () => {
            const uniqId = this.paramsUniqId();
            if (uniqId) {
                this.findOneFacade.reset();
                this.findOneFacade.read({ uniqId: uniqId }, true);
            } else {
                this.findOneFacade.reset();
                this.form.reset();
            }
        },
        { allowSignalWrites: true }
    );

    private readonly patchFormFromParticipant = effect(
        () => {
            const participant = this.currentParticipant();
            untracked(() => {
                if (participant && Object.keys(participant).length > 0) {
                    this.form.patchValue(
                        {
                            firstName: participant.firstName,
                            lastName: participant.lastName,
                            email: participant.email,
                            phone: participant.phone,
                            role: participant.role,
                        },
                        { emitEvent: false }
                    );
                }
            });
        },
        { allowSignalWrites: true }
    );

    ngOnInit(): void {
        this.rolesFacade.readAll();
        const uniqId = this.paramsUniqId();
        if (uniqId) {
            this.findOneFacade.read({ uniqId: uniqId }, true);
        }
    }

    getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        return this.validationService.getErrorMessage(
            fieldName,
            control?.errors || null
        );
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.showValidationErrors();
            return;
        }

        const title = this.helperService.getSweetAlertTitle(this.isEditMode());
        const message = this.helperService.getSweetAlertMessage(
            this.isEditMode()
        );

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(title),
            text: this.translate.instant(message),
            backdrop: false,
            confirmButtonText: this.translate.instant('COMMON.CONFIRM'),
            cancelButtonText: this.translate.instant('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.submitFormData();
            }
        });
    }

    onCancel(): void {
        this.helperService.navigateToParticipantsList();
    }

    private showValidationErrors(): void {
        const errors: string[] = [];
        const controlNames = [
            'firstName',
            'lastName',
            'email',
            'phone',
            'role',
        ] as const;

        controlNames.forEach((name) => {
            if (this.form.controls[name].invalid) {
                errors.push(this.getErrorMessage(name));
            }
        });

        this.validationService.showValidationErrors(
            this.messageService,
            errors
        );
    }

    private submitFormData(): void {
        const formData = this.form.getRawValue();
        const participantId = this.paramsUniqId();
        const operation =
            this.isEditMode() && participantId ? 'UPDATE' : 'CREATE';
        const submit =
            operation === 'UPDATE'
                ? this.participantsFacade.update({
                      uniqId: participantId,
                      ...formData,
                  })
                : this.participantsFacade.create(formData);

        submit.subscribe({
            next: () => this.helperService.navigateToParticipantsList(),
            error: (error: Error) =>
                this.helperService.displaySubmitError(
                    this.messageService,
                    operation,
                    error
                ),
        });
    }
}
