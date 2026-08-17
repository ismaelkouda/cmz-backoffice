import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    effect,
    inject,
    Signal,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TermsUseFacade } from '@pages/content-management/application/services/terms-use/terms-use.facade';
import { TermsUseFormHelperService } from '@pages/content-management/domain/services/terms-use/terms-use-form-helper.service';
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { TermsUseFormStore } from '@presentation/pages/content-management/application/store/terms-use/terms-use-form.store';
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
    selector: 'app-terms-use-form',
    templateUrl: './terms-use-form.component.html',
    styleUrls: ['./terms-use-form.component.scss'],
    standalone: true,
    imports: [
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ReactiveFormsModule,
        EditorModule,
        InputTextModule,
        ButtonModule,
        ToastModule,
    ],
    providers: [TermsUseFormHelperService, MessageService, TermsUseFormStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsUseFormComponent {
    readonly store = inject(TermsUseFormStore);

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(TermsUseFacade);
    private readonly helper = inject(TermsUseFormHelperService);
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
    private lastSuccess = this.submitFacade.actionSuccess();
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
        this.helper.navigateToTermsUseList();
    }
}
