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
import { UsersFacade } from '@pages/settings-security/application/services/users/users.facade';
import { FormValidators } from '@pages/settings-security/domain/validators/form-validators';
import { UsersStore } from '@pages/settings-security/presentation/store/users/users.store';
import { UsersFormHelperService } from '@pages/settings-security/presentation/users/users-form/users-form-helper.service';
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
    selector: 'app-users-form',
    templateUrl: './users-form.component.html',
    styleUrls: ['./users-form.component.scss'],
    standalone: true,
    imports: [
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
        UsersStore,
        FormValidationService,
        UsersFormHelperService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFormComponent {
    readonly store = inject(UsersStore);

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(UsersFacade);
    private readonly validation = inject(FormValidationService);
    private readonly helper = inject(UsersFormHelperService);

    public readonly form = this.store.form;
    public readonly loading = this.store.loading;

    readonly profiles = this.store.profiles;
    readonly loadingProfiles = this.store.loadingProfiles;
    // readonly rolesOptions = this.store.rolesOptions;

    public readonly isEditMode = this.store.isEditMode;

    public readonly loadingSubmit = computed(() => {
        return this.submitFacade.actionState() === 'loading';
    });
    readonly VALIDATION = FormValidators;
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
        const errors: string[] = [];
        const controlNames = [
            'firstName',
            'lastName',
            'email',
            'phone',
            'profile',
            // 'role',
        ] as const;

        controlNames.forEach((name) => {
            if (this.form.controls[name].invalid) {
                errors.push(this.getErrorMessage(name));
            }
        });

        if (errors.length) {
            SweetAlert.fire({
                icon: 'error',
                title: this.t('COMMON.ERRORS.FORM_INVALID'),
                html: `<ul style="text-align:left">${errors.map((e) => `<li>${e}</li>`).join('')}</ul>`,
            });
        }
    }

    getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        return this.validation.getErrorMessage(
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

        const title = this.helper.getSweetAlertTitle(this.isEditMode());
        const message = this.helper.getSweetAlertMessage(this.isEditMode());
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(title),
            html: this.t(message).replace(
                '{{email}}',
                this.form.controls.email.value || ''
            ),
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

    navigateToBack(): void {
        this.helper.navigateToUsersList();
    }
}
