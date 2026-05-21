import { CommonModule } from '@angular/common';
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
import { RegionsSelectFacade } from '@pages/administrative-boundary/application/services/regions/regions-select.facade';
import { DepartmentsFormHelperService } from '@pages/administrative-boundary/domain/services/departments/departments-form-helper.service';
import { FormValidators } from '@pages/administrative-boundary/domain/validators/form-validators';
import { DepartmentsFormStore } from '@presentation/pages/administrative-boundary/application/store/departments/departments-form.store';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map, switchMap } from 'rxjs';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-departments-form',
    templateUrl: './departments-form.component.html',
    styleUrls: ['./departments-form.component.scss'],
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
    providers: [DepartmentsFormStore, DepartmentsFormHelperService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentsFormComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly title = inject(Title);
    private readonly toast = inject(ToastrService);
    private readonly sweetAlert = inject(SweetAlertService);

    private readonly translate = inject(TranslateService);
    protected readonly formStore = inject(DepartmentsFormStore);
    protected readonly isEditMode = this.formStore.isEditMode;

    private readonly canCreate = this.permissionActions.can(
        '/territorial-structure/departments',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/territorial-structure/departments',
        'edit'
    );

    private readonly regionsFacade = inject(RegionsSelectFacade);
    protected readonly regions = toSignal(this.regionsFacade.items$, {
        initialValue: [],
    });
    protected readonly loadingRegions = toSignal(
        this.regionsFacade.isLoading$,
        {
            initialValue: false,
        }
    );

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
            ? 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.TITLE_FORM_EDI'
            : 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.TITLE_FORM_ADD'
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
        this.regionsFacade.readAll(true);
        if (!uniqId) {
            this.formStore.openCreate();
            return;
        }
        this.formStore.openEdit(uniqId);
    }

    private showValidationErrors(): void {
        const controlNames = ['code', 'name', 'region', 'description'] as const;

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
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.CREATE');
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.NOT_EDIT');
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
                ? 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.TITLE.EDIT'
                : 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.TITLE.CREATE',
            messageKey: isEdit
                ? 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.MESSAGE.EDIT'
                : 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.MESSAGE.CREATE',
            messageParams: {
                uniqId,
            },
        });
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }
}
