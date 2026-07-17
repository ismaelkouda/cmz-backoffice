import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SiteGroupFacade } from '@pages/coverage-areas/application/services/site-group/site-group.facade';
import { SiteGroupFormStore } from '@pages/coverage-areas/presentation/store/site-group/site-group-form.store';
import { SiteGroupFormHelperService } from '@pages/coverage-areas/presentation/features/site-group/site-group-form/site-group-form-helper.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { ToastrService } from 'ngx-toastr';

const PERMISSION_PATH = '/coverage-areas/site-groups';

@Component({
    selector: 'app-site-group-form',
    templateUrl: './site-group-form.component.html',
    styleUrls: ['./site-group-form.component.scss'],
    standalone: true,
    imports: [
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        TagModule,
        ToastModule,
        TooltipModule,
    ],
    providers: [
        MessageService,
        SiteGroupFormStore,
        FormValidationService,
        SiteGroupFormHelperService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteGroupFormComponent implements OnInit {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(SiteGroupFacade);
    private readonly validation = inject(FormValidationService);
    private readonly helper = inject(SiteGroupFormHelperService);
    private readonly store = inject(SiteGroupFormStore);
    private readonly toast = inject(ToastrService);

    protected readonly form = this.store.form;
    protected readonly isDetailsMode = this.store.isDetailsMode;
    protected readonly isEditMode = this.store.isEditMode;
    protected readonly isCreateMode = this.store.isCreateMode;
    protected readonly loading = this.store.loading;

    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    protected readonly loadingSubmit = computed(() => {
        return this.submitFacade.actionState() === 'loading';
    });
    private readonly canCreate = this.permissionActions.can(
        PERMISSION_PATH,
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        PERMISSION_PATH,
        'edit'
    );

    protected readonly titleMode = computed(() => {
        if (this.isDetailsMode()) {
            return this.translate.instant(
                'COVERAGE_AREAS.SITE_GROUP.FORM.DETAILS_TITLE'
            );
        } else if (this.isEditMode()) {
            return this.translate.instant(
                'COVERAGE_AREAS.SITE_GROUP.FORM.EDIT_TITLE'
            );
        } else {
            return this.translate.instant(
                'COVERAGE_AREAS.SITE_GROUP.FORM.CREATE_TITLE'
            );
        }
    });
    private readonly submitSuccess = signal(false);
    private lastSubmitSuccess = this.submitFacade.actionSuccess();

    private readonly formStateEffect = effect(() => {
        const state = this.submitFacade.actionState();

        if (state === 'loading') {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }
    });

    private readonly submitSuccessEffect = effect(() => {
        const current = this.submitFacade.actionSuccess();
        if (current !== this.lastSubmitSuccess && !this.submitSuccess()) {
            this.lastSubmitSuccess = current;
            this.submitSuccess.set(true);
            this.navigateToBack();
        }
    });

    constructor() {
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => this.currentLang.set(event.lang));
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams
            .pipe(
                tap((params) => {
                    const uniqId = params['uniqId'];
                    this.store.setMode(uniqId, params['ref']);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        return this.validation.getErrorMessage(
            fieldName,
            control?.errors || null
        );
    }

    isFieldInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }
    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.CREATE');
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(
                'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NOT_EDIT');
    });

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (!this.canCreate() && this.isCreateMode()) {
            this.toast.error(this.createTooltip());
            return;
        }

        if (!this.isEditMode() && this.isEditMode()) {
            this.toast.error(this.editTooltip());
            return;
        }

        const title = this.helper.getSweetAlertTitle(this.isEditMode());
        const message = this.helper.getSweetAlertMessage(this.isEditMode());

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(title),
            text: this.t(message),
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
        const formValue = this.form.getRawValue();
        this.submitSuccess.set(false);

        if (this.isEditMode()) {
            this.activatedRoute.queryParams
                .pipe(
                    map((params) => params['uniqId'] as string),
                    tap((uniqId) => {
                        this.submitFacade.update({
                            uniqId,
                            ...formValue,
                        });
                    }),
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe();
        } else {
            this.submitFacade.create(formValue);
        }
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    protected navigateToBack(): void {
        this.helper.navigateToSiteGroupList();
    }
}
