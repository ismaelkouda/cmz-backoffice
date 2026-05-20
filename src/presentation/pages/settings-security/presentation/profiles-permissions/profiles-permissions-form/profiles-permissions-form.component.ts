import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProfilesPermissionsFacade } from '@pages/settings-security/application/services/profiles-permissions/profiles-permissions.facade';
import { ProfilesPermissionsFormHelperService } from '@pages/settings-security/domain/services/profiles-permissions/profiles-permissions-form-helper.service';
import { ProfilesPermissionsFormValidationService } from '@pages/settings-security/domain/services/profiles-permissions/profiles-permissions-form-validation.service';
import { FormValidators } from '@pages/settings-security/domain/validators/form-validators';
import { ProfilesPermissionsFormSkeletonComponent } from '@pages/settings-security/presentation/profiles-permissions/profiles-permissions-form-skeleton/profiles-permissions-form-skeleton.component';
import { TreeNodeInterface } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-tree-node.interface';
import { ProfilesPermissionsFormStore } from '@presentation/pages/settings-security/presentation/store/profiles-permissions/profiles-permissions-form.store';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { PermissionAction } from '@shared/domain/types/permission-action.type';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
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
        TreeTableModule,
        FormsModule,
        CheckboxModule,
    ],
    providers: [
        MessageService,
        ProfilesPermissionsFormStore,
        ProfilesPermissionsFormValidationService,
        ProfilesPermissionsFormHelperService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilesPermissionsFormComponent {
    readonly store = inject(ProfilesPermissionsFormStore);
    private readonly route = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly facade = inject(ProfilesPermissionsFacade);

    readonly form = this.store.form;
    readonly tree = this.store.tree;
    readonly selectedCount = this.store.selectedCount;

    readonly isEditMode = this.store.isEditMode;

    readonly loading = this.store.loading;
    readonly loadingPermissions = this.store.loadingPermissions;
    readonly loadingSubmit = toSignal(this.facade.isLoading$);

    private readonly helper = inject(ProfilesPermissionsFormHelperService);
    private readonly validation = inject(
        ProfilesPermissionsFormValidationService
    );
    readonly VALIDATION = FormValidators;
    private lastSuccess = this.facade.actionSuccess();
    private readonly formStateEffect = effect(() => {
        const state = this.facade.actionState();
        if (state === 'loading') {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }
    });
    private readonly successEffect = effect(() => {
        const current = this.facade.actionSuccess();
        if (current === this.lastSuccess) {
            return;
        }

        this.lastSuccess = current;
        this.navigateToBack();
    });

    constructor() {
        const uniqId = this.route.snapshot.queryParamMap.get('uniqId');
        this.store.setMode(uniqId || undefined);
    }

    getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        return this.validation.getErrorMessage(
            fieldName,
            control?.errors || null
        );
    }

    onPermissionChange(rowNode: any, action: string, checked: boolean): void {
        this.store.updatePermission(rowNode.node, action, checked);
    }

    getActionState(
        node: TreeNodeInterface,
        action: PermissionAction
    ): 'checked' | 'unchecked' | 'indeterminate' {
        return this.store.getActionState(node, action);
    }

    onExpandAll(): void {
        this.store.expandAll();
    }

    onCollapseAll(): void {
        this.store.collapseAll();
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const title = this.helper.getSweetAlertTitle(this.isEditMode());
        const message = this.helper.getSweetAlertMessage(this.isEditMode());
        this.store.selectedNodes();
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(title),
            text: this.t(message),
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                const payload = this.store.getPayload();
                const uniqId = this.route.snapshot.queryParamMap.get('uniqId');
                if (this.isEditMode() && uniqId) {
                    this.facade.update({
                        uniqId,
                        ...payload,
                    });
                } else {
                    this.facade.create(payload);
                }
            }
        });
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    navigateToBack(): void {
        this.helper.navigateToProfilesPermissionsList();
    }
}
