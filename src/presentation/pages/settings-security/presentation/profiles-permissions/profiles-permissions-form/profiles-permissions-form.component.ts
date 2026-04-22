import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProfilesPermissionsFacade } from '@pages/settings-security/application/services/profiles-permissions/profiles-permissions.facade';
import { ProfilesPermissionsFormHelperService } from '@pages/settings-security/domain/services/profiles-permissions/profiles-permissions-form-helper.service';
import { ProfilesPermissionsFormValidationService } from '@pages/settings-security/domain/services/profiles-permissions/profiles-permissions-form-validation.service';
import { FormValidators } from '@pages/settings-security/domain/validators/form-validators';
import { ProfilesPermissionsFormSkeletonComponent } from '@pages/settings-security/presentation/profiles-permissions/profiles-permissions-form-skeleton/profiles-permissions-form-skeleton.component';
import { ProfilesPermissionsStore } from '@pages/settings-security/presentation/store/profiles-permissions/profiles-permissions.store';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-profiles-permissions-form',
    templateUrl: './profiles-permissions-form.component.html',
    styleUrls: ['./profiles-permissions-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ProfilesPermissionsFormSkeletonComponent,
        ReactiveFormsModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        ButtonModule,
        TagModule,
        ToastModule,
        TooltipModule,
        TreeModule,
    ],
    providers: [
        MessageService,
        ProfilesPermissionsStore,
        ProfilesPermissionsFormValidationService,
        ProfilesPermissionsFormHelperService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilesPermissionsFormComponent {
    readonly store = inject(ProfilesPermissionsStore);

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(ProfilesPermissionsFacade);
    private readonly helper = inject(ProfilesPermissionsFormHelperService);
    private readonly validation = inject(
        ProfilesPermissionsFormValidationService
    );

    public readonly form = this.store.form;
    public readonly loading = this.store.loading;
    readonly permissions = this.store.permissions;
    readonly loadingPermissions = this.store.loadingPermissions;
    public readonly isEditMode = this.store.isEditMode;

    public readonly loadingSubmit = toSignal(this.submitFacade.isLoading$);
    readonly VALIDATION = FormValidators;
    private lastSuccess = this.submitFacade.actionSuccess();
    readonly permissionTree = this.store.permissionTree;
    readonly selectedNodes = this.store.selectedNodes;
    readonly selectedCount = this.store.selectedCount;

    constructor() {
        const uniqId = this.activatedRoute.snapshot.queryParamMap.get('uniqId');
        this.store.setMode(uniqId || undefined);
    }

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

    onTreeInteractions(): void {
        this.store.updateSelectedNodes(this.selectedNodes());
    }

    onExpandAll(): void {
        this.store.expandAll();
    }

    onCollapseAll(): void {
        this.store.collapseAll();
    }

    private showValidationErrors(): void {
        const controlNames = ['name', 'description'] as const;

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
        const payload = this.form.getRawValue();
        const uniqId = this.activatedRoute.snapshot.queryParamMap.get('uniqId');
        if (this.isEditMode() && uniqId) {
            this.submitFacade.update({
                uniqId,
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
        this.helper.navigateToProfilesPermissionsList();
    }
}
