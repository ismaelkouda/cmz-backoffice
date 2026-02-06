import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    signal,
    Signal,
    WritableSignal,
    DestroyRef,
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
import { TreeModule } from 'primeng/tree';
import { map } from 'rxjs';
import SweetAlert from 'sweetalert2';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { TreeNodeInterface } from '@shared/interfaces/tree-node.interface';
import { SETTINGS_SECURITY_ROUTE } from '@shared/routes/routes';
import { PermissionTreeService } from '@shared/services/permission-tree-node.service';

import { ProfilsHabilitationsFindOneFacade } from '@presentation/pages/settings-security/core/application/services/profils-habilitations/profils-habilitations-findone.facade';
import { ProfilsHabilitationsFacade } from '@presentation/pages/settings-security/core/application/services/profils-habilitations/profils-habilitations.facade';
import { ProfilsHabilitationsFormControls } from '@presentation/pages/settings-security/core/domain/controls/profils-habilitations/profils-habilitations-form.control';
import { FormValidators } from '@presentation/pages/settings-security/core/domain/validators/form-validators';
import { ProfilsHabilitationsFormValidationService } from '@presentation/pages/settings-security/presentation/profils-habilitations/profils-habilitations-form/profils-habilitations-form-validation.service';
import { PROFILES_HABILITATIONS_ROUTE } from '@presentation/pages/settings-security/settings-security.routes';

@Component({
    selector: 'app-profils-habilitations-form',
    templateUrl: './profils-habilitations-form.component.html',
    styleUrls: ['./profils-habilitations-form.component.scss'],
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
        TreeModule,
    ],
    providers: [
        MessageService,
        PermissionTreeService,
        ProfilsHabilitationsFormValidationService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilsHabilitationsFormComponent {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly submitFacade = inject(ProfilsHabilitationsFacade);
    private readonly facade = inject(ProfilsHabilitationsFindOneFacade);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly treeService = inject(PermissionTreeService);
    private readonly validationService = inject(
        ProfilsHabilitationsFormValidationService
    );
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
    readonly permissionTree: WritableSignal<TreeNodeInterface[]> = signal([]);

    private readonly updatePermissionTree = effect(
        () => {
            const item = this.items();
            const tree = item?.permissions
                ? this.treeService.transformPermissionsToTree(item.permissions)
                : [];
            this.permissionTree.set(tree);
        },
        { allowSignalWrites: true }
    );
    public selectedNodes: TreeNodeInterface[] = [];
    readonly form: FormGroup<ProfilsHabilitationsFormControls> =
        this.fb.nonNullable.group<ProfilsHabilitationsFormControls>({
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
            permissions: new FormControl([], {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

    private readonly patchFormFromProfile = effect(
        () => {
            const profileHabilitation = this.items();
            if (
                profileHabilitation &&
                Object.keys(profileHabilitation).length > 0
            ) {
                this.form.patchValue(
                    {
                        name: profileHabilitation.name,
                        description: profileHabilitation.description,
                    },
                    { emitEvent: false }
                );
            }
        },
        { allowSignalWrites: true }
    );

    private readonly initializeFormFromProfile = effect(
        () => {
            const treeNodes = this.permissionTree();
            if (treeNodes.length > 0) {
                const checkedNodes = this.collectCheckedNodes(treeNodes);
                this.selectedNodes = [...checkedNodes];
            } else {
                this.selectedNodes = [];
            }
        },
        { allowSignalWrites: true }
    );

    private collectCheckedNodes(
        nodes: TreeNodeInterface[]
    ): TreeNodeInterface[] {
        const result: TreeNodeInterface[] = [];
        for (const node of nodes) {
            if (node.checked) {
                result.push(node);
            }
            if (node.children?.length) {
                result.push(...this.collectCheckedNodes(node.children));
            }
        }
        return result;
    }

    private readonly handleRouteParamsChange = effect(
        () => {
            const uniqId = this.paramsUniqId();
            if (uniqId) {
                this.facade.reset();
                this.facade.read({ uniqId }, true);
            } else {
                this.facade.reset();
                this.form.reset();
            }
        },
        { allowSignalWrites: true }
    );

    onExpandAll(): void {
        const treeNodes = this.permissionTree();
        const expandedNodes = this.treeService.expandAll(treeNodes);
        this.permissionTree.set(expandedNodes);
    }

    onCollapseAll(): void {
        const treeNodes = this.permissionTree();
        const collapsedNodes = this.treeService.collapseAll(treeNodes);
        this.permissionTree.set(collapsedNodes);
    }

    onTreeInteractions(): void {
        const selectedPermissions = this.treeService.collectLeafKeysFromNodes(
            this.selectedNodes
        );
        this.form.controls.permissions.setValue(selectedPermissions);
    }

    // getSelectedPermissionsCount(): number {
    //     const selected = this.treeService.convertSelectionKeysToArray(
    //         this.selectedKeys()
    //     );
    //     return selected.length;
    // }

    trackByKey(_index: number, node: TreeNodeInterface): string {
        return node.key;
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

        if (this.form.controls.permissions.invalid) {
            errors.push(
                this.translate.instant(
                    'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FORM.VALIDATION.PERMISSIONS_REQUIRED'
                )
            );
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
            ? 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.SWEET_ALERT.TITLE_UPDATE'
            : 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.SWEET_ALERT.TITLE_CREATE';
    }

    private getSweetAlertMessage(): string {
        return this.isEditMode()
            ? 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.SWEET_ALERT.MESSAGE_UPDATE'
            : 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.SWEET_ALERT.MESSAGE_CREATE';
    }

    onCancel(): void {
        this.router.navigate([
            `${SETTINGS_SECURITY_ROUTE}/${PROFILES_HABILITATIONS_ROUTE}`,
        ]);
    }
}
