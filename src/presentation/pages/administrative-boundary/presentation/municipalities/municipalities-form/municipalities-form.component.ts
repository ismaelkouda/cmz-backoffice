import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
} from '@angular/core';
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MunicipalitiesFormHelperService } from '@pages/administrative-boundary/domain/services/municipalities/municipalities-form-helper.service';
import { FormValidators } from '@pages/administrative-boundary/domain/validators/form-validators';
import { MunicipalitiesFormStore } from '@presentation/pages/administrative-boundary/application/store/municipalities/municipalities-form.store';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map, switchMap } from 'rxjs';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-municipalities-form',
    templateUrl: './municipalities-form.component.html',
    styleUrls: ['./municipalities-form.component.scss'],
    standalone: true,
    imports: [
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ReactiveFormsModule,
        InputNumberModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        ButtonModule,
        TagModule,
        ToastModule,
        TooltipModule,
    ],
    providers: [MunicipalitiesFormStore, MunicipalitiesFormHelperService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MunicipalitiesFormComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly title = inject(Title);
    private readonly toast = inject(ToastrService);
    private readonly sweetAlert = inject(SweetAlertService);

    private readonly translate = inject(TranslateService);
    protected readonly formStore = inject(MunicipalitiesFormStore);
    protected readonly isEditMode = this.formStore.isEditMode;

    private readonly canCreate = this.permissionActions.can(
        '/territorial-structure/municipalities',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/territorial-structure/municipalities',
        'edit'
    );

    protected readonly regions = this.formStore.regions;
    protected readonly loadingRegions = this.formStore.loadingRegions;
    protected readonly departments = this.formStore.departments;

    private readonly validation = inject(FormValidationService);
    protected readonly VALIDATION = FormValidators;

    private readonly queryParams = toSignal(
        this.route.queryParams.pipe(map((params: Params) => params)),
        { initialValue: {} }
    );
    protected readonly uniqId = computed(() => this.getQueryParam('uniqId'));
    private getQueryParam(key: string): string {
        const params = this.queryParams() as Record<string, string>;
        return params[key] ?? '';
    }
    private readonly pageTitleKey = computed(() =>
        this.uniqId()
            ? 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.TITLE_FORM_EDI'
            : 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FORM.TITLE_FORM_ADD'
    );
    private readonly pageTitle$ = toObservable(this.pageTitleKey).pipe(
        switchMap((key) => this.translate.stream(key)),
        takeUntilDestroyed(this.destroyRef)
    );
    constructor() {
        this.pageTitle$.subscribe((translatedTitle) => {
            this.title.setTitle(translatedTitle);
        });
        this.initializeFetchEffect();
    }
    private initializeFetchEffect(): void {
        const uniqId = this.uniqId();
        if (!uniqId) {
            this.formStore.openCreate();
            return;
        }
        this.formStore.openEdit(uniqId);
    }

    private showValidationErrors(): void {
        const controlNames = [
            'code',
            'name',
            'region',
            'department',
            'description',
        ] as const;

        const errors = controlNames
            .filter((name) => this.formStore.form.controls[name].invalid)
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
        const control = this.formStore.form.get(fieldName);
        return this.validation.getErrorMessage(
            fieldName,
            control?.errors || null
        );
    }

    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.CREATE');
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.NOT_EDIT'
        );
    });
    protected async onSubmit(): Promise<void> {
        if (this.formStore.form.invalid) {
            this.formStore.form.markAllAsTouched();
            this.showValidationErrors();
            return;
        }

        if (!this.showPermissionErrors()) {
            return;
        }

        const confirmed = await this.confirmSaveAction();
        if (!confirmed) {
            return;
        }

        this.formStore.submit();
    }

    private showPermissionErrors(): boolean {
        if (!this.uniqId() && !this.canCreate()) {
            this.toast.error(this.createTooltip());
            return false;
        }
        if (this.uniqId() && !this.canEdit()) {
            this.toast.error(this.editTooltip());
            return false;
        }
        return true;
    }
    private async confirmSaveAction(): Promise<boolean> {
        const isEdit = this.formStore.isEditMode();
        const uniqId = this.uniqId();
        return this.sweetAlert.confirm({
            titleKey: isEdit
                ? 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.TITLE.EDIT'
                : 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.TITLE.CREATE',
            messageKey: isEdit
                ? 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.MESSAGE.EDIT'
                : 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.MESSAGE.CREATE',
            messageParams: {
                uniqId,
            },
        });
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }
}
