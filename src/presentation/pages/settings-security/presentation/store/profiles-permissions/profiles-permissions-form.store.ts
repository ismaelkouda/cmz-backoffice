import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ProfilesPermissionsFindOneFacade } from '@pages/settings-security/application/services/profiles-permissions/profiles-permissions-find-one.facade';
import { ProfilesPermissionsPermissionsFacade } from '@pages/settings-security/application/services/profiles-permissions/profiles-permissions-permissions.facade';
import { FormValidators } from '@pages/team-organization/domain/validators/form-validators';
import { TreeNodeInterface } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-tree-node.interface';
import { PermissionTreeService } from '@presentation/pages/settings-security/presentation/adapters/profiles-permissions/permission-tree-node.service';
import { ProfilesPermissionsFormControls } from '@presentation/pages/settings-security/presentation/store/profiles-permissions/profiles-permissions-form.control';
import { PermissionAction } from '@shared/domain/types/permission-action.type';

@Injectable()
export class ProfilesPermissionsFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly findOneFacade = inject(ProfilesPermissionsFindOneFacade);
    private readonly permissionsFacade = inject(
        ProfilesPermissionsPermissionsFacade
    );
    public readonly treeService = inject(PermissionTreeService);

    public readonly isEditMode = signal(false);

    public readonly loading = this.findOneFacade.loading;
    readonly loadingPermissions = this.permissionsFacade.loading;

    readonly form = this.createForm();

    readonly tree = signal<TreeNodeInterface[]>([]);

    readonly selectedNodes = computed(() =>
        this.treeService.collectCheckedNodes(this.tree())
    );

    readonly getActionState = (
        node: TreeNodeInterface,
        action: PermissionAction
    ): 'checked' | 'unchecked' | 'indeterminate' =>
        this.treeService.getActionState(node, action);

    readonly selectedCount = computed(() => this.selectedNodes().length);

    constructor() {
        this.registerEffects();
    }

    private registerEffects(): void {
        effect(() => {
            const item = this.findOneFacade.items();

            if (!this.isEditMode() || !item) {
                return;
            }

            this.form.patchValue(
                {
                    name: item.name ?? '',
                    description: item.description ?? '',
                },
                { emitEvent: false }
            );

            const nodes = this.treeService.mapNodes(item.permissions);

            this.attachParents(nodes);
            this.treeService.recalculateTreeState(nodes);

            this.tree.set(nodes);

            this.syncFormPermissions();
        });

        effect(() => {
            const permissions = this.permissionsFacade.items();

            if (this.isEditMode()) {
                return;
            }

            if (!permissions?.props?.permissions) {
                return;
            }

            const nodes = this.treeService.mapNodes(
                permissions.props.permissions
            );

            this.attachParents(nodes);

            this.tree.set(nodes);

            this.syncFormPermissions();
        });
    }

    private createForm(): FormGroup<ProfilesPermissionsFormControls> {
        return this.fb.nonNullable.group<ProfilesPermissionsFormControls>({
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
    }

    setMode(uniqId?: string): void {
        this.resetState();

        this.isEditMode.set(!!uniqId);

        if (uniqId) {
            this.findOneFacade.read({ uniqId }, true);
        } else {
            this.permissionsFacade.readAll();
        }
    }

    updatePermission(
        node: TreeNodeInterface,
        action: string,
        checked: boolean
    ): void {
        this.treeService.updateNodeAction(node, action, checked);
        this.syncFormPermissions();
    }

    updateNode(node: TreeNodeInterface, checked: boolean): void {
        this.treeService.updateNodeSelection(node, checked);
        this.syncFormPermissions();
    }

    expandAll(): void {
        this.tree.update((nodes) => this.treeService.expandAll(nodes));
    }

    collapseAll(): void {
        this.tree.update((nodes) => this.treeService.collapseAll(nodes));
    }

    getPayload() {
        const raw = this.form.getRawValue();

        return {
            ...raw,
            permissions: this.treeService.flatten(this.tree()),
        };
    }

    private syncFormPermissions(): void {
        this.form.controls.permissions.setValue(
            this.treeService.flatten(this.tree()) as any,
            { emitEvent: false }
        );
    }

    private attachParents(
        nodes: TreeNodeInterface[],
        parent?: TreeNodeInterface
    ): void {
        nodes.forEach((node) => {
            node.parent = parent;

            if (node.children?.length) {
                this.attachParents(node.children, node);
            }
        });
    }

    private resetState(): void {
        this.form.reset();

        this.tree.set([]);

        this.findOneFacade.reset();
        this.permissionsFacade.reset();
    }
}
