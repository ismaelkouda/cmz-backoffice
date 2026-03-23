import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    Signal,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PrivacyPolicyFacade } from '@pages/content-management/application/services/privacy-policy/privacy-policy.facade';
import { PrivacyPolicyFormStore } from '@pages/content-management/application/store/privacy-policy-form/privacy-policy-form.store';
import { PrivacyPolicyFormHelperService } from '@pages/content-management/domain/services/privacy-policy/privacy-policy-form-helper.service';
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-privacy-policy-form',
    templateUrl: './privacy-policy-form.component.html',
    styleUrls: ['./privacy-policy-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ReactiveFormsModule,
        EditorModule,
        InputTextModule,
        ButtonModule,
        ToastModule,
    ],
    providers: [
        PrivacyPolicyFormHelperService,
        MessageService,
        PrivacyPolicyFormStore,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyFormComponent {
    readonly store = inject(PrivacyPolicyFormStore);

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(PrivacyPolicyFacade);
    private readonly helper = inject(PrivacyPolicyFormHelperService);
    private readonly validation = inject(FormValidationService);

    public readonly form = this.store.form;
    public readonly loading = this.store.loading;
    public readonly isEditMode = this.store.isEditMode;
    public readonly contentCharacterCount = this.store.contentCharacterCount;
    public readonly versionLength = this.store.versionLength;

    public readonly loadingSubmit = toSignal(this.submitFacade.isLoading$);

    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    private readonly uniqId: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map(
                (params: Record<string, unknown>) =>
                    (params['uniqId'] as string) || ''
            ),
            tap((uniqId) => this.store.setEditMode(uniqId)),
            takeUntilDestroyed(this.destroyRef)
        ),
        { initialValue: '' }
    );

    constructor() {
        this.translate.onLangChange
            .pipe(takeUntilDestroyed())
            .subscribe((lang) => this.currentLang.set(lang.lang));
    }

    public getErrorMessage(field: string): string {
        const control = this.form.get(field);
        return this.validation.getErrorMessage(field, control?.errors || null);
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const title = this.helper.getSweetAlertTitle(this.isEditMode());
        const message = this.helper.getSweetAlertMessage(this.isEditMode());

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(title),
            text: this.translate.instant(message),
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            }

            const payload = this.form.getRawValue();

            if (this.isEditMode()) {
                this.submitFacade.update({
                    uniqId: this.uniqId(),
                    ...payload,
                });
            } else {
                this.submitFacade.create(payload);
            }
        });
    }

    public get allowed(): typeof FormValidators {
        return FormValidators;
    }

    public isFieldInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }

    navigateToBack(): void {
        this.helper.navigateToPrivacyPolicyList();
    }
}
