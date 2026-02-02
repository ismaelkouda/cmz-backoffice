import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Signal,
    DestroyRef,
    OnInit,
    effect,
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
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
import { TEAM_ORGANIZATION_ROUTE } from '@shared/routes/routes';

import { TeamsFindOneFacade } from '@presentation/pages/team-organization/application/services/teams/teams-findone.facade';
import { TeamsFacade } from '@presentation/pages/team-organization/application/services/teams/teams.facade';
import { TeamsFormControls } from '@presentation/pages/team-organization/domain/controls/teams/teams-form.control';
import { FormValidators } from '@presentation/pages/team-organization/domain/validators/form-validators';
import { TeamsFormValidationService } from '@presentation/pages/team-organization/presentation/teams/teams-form/teams-form-validation.service';
import { TEAMS_ROUTE } from '@presentation/pages/team-organization/team-organization.routes';

@Component({
    selector: 'app-teams-form',
    templateUrl: './teams-form.component.html',
    styleUrls: ['./teams-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ReactiveFormsModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        ButtonModule,
        TagModule,
        ToastModule,
        TooltipModule,
    ],
    providers: [MessageService, TeamsFormValidationService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsFormComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly submitFacade = inject(TeamsFacade);
    private readonly facade = inject(TeamsFindOneFacade);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly validationService = inject(TeamsFormValidationService);
    readonly VALIDATION = FormValidators;
    readonly items = toSignal(this.facade.item$, { initialValue: null });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    private readonly paramsUniqId: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map(
                (params: Record<string, unknown>) =>
                    (params['uniqId'] as string) || ''
            )
        ),
        { initialValue: '' }
    );
    readonly isEditMode = computed(() => !!this.paramsUniqId());

    readonly form: FormGroup<TeamsFormControls> =
        this.fb.nonNullable.group<TeamsFormControls>({
            code: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.CODE.MIN),
                    Validators.maxLength(FormValidators.CODE.MAX),
                    Validators.pattern(FormValidators.CODE.PATTERN),
                ],
            }),
            name: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.NAME.MIN),
                    Validators.maxLength(FormValidators.NAME.MAX),
                    Validators.pattern(FormValidators.NAME.PATTERN),
                ],
            }),
            description: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.DESCRIPTION.MIN),
                    Validators.maxLength(FormValidators.DESCRIPTION.MAX),
                    Validators.pattern(FormValidators.DESCRIPTION.PATTERN),
                ],
            }),
        });

        private readonly patchFormFromItem = effect(
            () => {
                const item = this.items();
                if (
                    item &&
                    Object.keys(item).length > 0
                ) {
                    this.form.patchValue(
                        {
                            code: item.code,
                            name: item.name,
                            description: item.description,
                        },
                        { emitEvent: false }
                    );
                }
            },
            { allowSignalWrites: true }
        );

    ngOnInit(): void {
        const uniqId = this.paramsUniqId();
        if (uniqId) {
            this.facade.read({ uniqId }, true);
        }
    }

    getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        return this.validationService.getErrorMessage(
            fieldName,
            control?.errors || null
        );
    }

    private showValidationErrors(): void {
        const errors: string[] = [];

        if (this.form.controls.name.invalid) {
            errors.push(this.getErrorMessage('name'));
        }

        if (this.form.controls.description.invalid) {
            errors.push(this.getErrorMessage('description'));
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.showValidationErrors();
            return;
        }

        const title = this.getSweetAlertTitle();
        const message = this.getSweetAlertMessage();

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

    private submitFormData(): void {
        const formData = this.form.getRawValue();
        const uniqId = this.paramsUniqId();

        if (this.isEditMode() && uniqId) {
            this.submitFacade
                .update({ uniqId, ...formData })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: () => {
                        this.onCancel();
                        this.submitFacade.refreshWithLastFilterAndPage();
                    },
                });
        } else {
            this.submitFacade
                .create(formData)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: () => {
                        this.onCancel();
                        this.submitFacade.refreshWithLastFilterAndPage();
                    },
                });
        }
    }

    private getSweetAlertTitle(): string {
        return this.isEditMode()
            ? 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.TITLE_UPDATE'
            : 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.TITLE_CREATE';
    }

    private getSweetAlertMessage(): string {
        return this.isEditMode()
            ? 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.MESSAGE_UPDATE'
            : 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.MESSAGE_CREATE';
    }

    onCancel(): void {
        this.router.navigate([`${TEAM_ORGANIZATION_ROUTE}/${TEAMS_ROUTE}`]);
    }
}
