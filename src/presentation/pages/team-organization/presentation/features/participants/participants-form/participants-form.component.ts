import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    Signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ParticipantsFacade } from '@pages/team-organization/application/services/participants/participants.facade';
import { ParticipantsFormHelperService } from '@pages/team-organization/domain/services/participants/participants-form-helper.service';
import { FormValidators } from '@pages/team-organization/domain/validators/form-validators';
import { ParticipantsFormStore } from '@presentation/pages/team-organization/presentation/store/participants/participants-form.store';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';

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
        ParticipantsFormHelperService,
        ParticipantsFormStore,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsFormComponent {
    protected readonly store = inject(ParticipantsFormStore);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(ParticipantsFacade);
    private readonly helper = inject(ParticipantsFormHelperService);
    private readonly validation = inject(FormValidationService);
    protected readonly form = this.store.form;
    protected readonly loading = this.store.loading;
    protected readonly isEditMode = this.store.isEditMode;
    protected readonly loadingSubmit = computed(() => {
        return this.submitFacade.actionState() === 'loading';
    });
    protected readonly VALIDATION = FormValidators;
    private lastSuccess = this.submitFacade.actionSuccess();
    private readonly uniqId: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map(
                (params: Record<string, unknown>) =>
                    (params['uniqId'] as string) || ''
            ),
            tap((uniqId) => this.store.setMode(uniqId)),
            takeUntilDestroyed(this.destroyRef)
        ),
        { initialValue: '' }
    );
    private readonly formStateEffect = effect(() => {
        const state = this.submitFacade.actionState();
        if (state === 'loading') {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }
    });
    private readonly successEffect = effect(() => {
        const current = this.submitFacade.actionSuccess();
        if (current === this.lastSuccess) {
            return;
        }

        this.lastSuccess = current;
        this.navigateToBack();
    });
    private showValidationErrors(): void {
        const controlNames = [
            'firstName',
            'lastName',
            'email',
            'phone',
            // 'role',
        ] as const;

        const errors = controlNames
            .filter((name) => this.form.controls[name].invalid)
            .map((name) => this.getErrorMessage(name));

        if (errors.length) {
            SweetAlert.fire({
                icon: 'error',
                title: this.t('COMMON.ERRORS.FORM_INVALID'),
                html: `<ul style="text-align:left">${errors.map((e) => `<li>${e}</li>`).join('')}</ul>`,
            });
        }
    }
    protected getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        return this.validation.getErrorMessage(
            fieldName,
            control?.errors || null
        );
    }
    protected onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.showValidationErrors();
            return;
        }
        const title = this.helper.getSweetAlertTitle(this.isEditMode());
        const message = this.helper.getSweetAlertMessage(this.isEditMode());
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(title),
            html: this.t(message),
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.submitForm();
            }
        });
    }
    private submitForm(): void {
        const payload = this.form.getRawValue();
        if (this.isEditMode()) {
            this.submitFacade.update({
                uniqId: this.uniqId(),
                ...payload,
            });
        } else {
            this.submitFacade.create(payload);
        }
    }
    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }
    protected navigateToBack(): void {
        this.helper.navigateToParticipantsList();
    }
}
