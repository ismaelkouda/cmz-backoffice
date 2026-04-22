import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { TeamsFindOneFacade } from '@pages/team-organization/application/services/teams/teams-find-one.facade';
import { TeamsPermissionsFacade } from '@pages/team-organization/application/services/teams/teams-permissions.facade';
import { TeamsFormControls } from '@pages/team-organization/domain/controls/teams/teams-form.control';
import { FormValidators } from '@pages/team-organization/domain/validators/form-validators';
import { TreeNodeInterface } from '@shared/domain/interfaces/tree-node.interface';
import { PermissionTreeService } from '@shared/domain/services/permission-tree-node.service';

@Injectable()
export class TeamsFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(TeamsFindOneFacade);
    private readonly permissionsFacade = inject(TeamsPermissionsFacade);
    private readonly treeService = inject(PermissionTreeService);
    private readonly isPatching = signal(false);
    public readonly isEditMode = signal(false);
    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;
    readonly permissions = this.permissionsFacade.items;
    readonly loadingPermissions = this.permissionsFacade.loading;

    readonly selectedNodes = signal<TreeNodeInterface[]>([]);

    readonly form: FormGroup<TeamsFormControls> = this.createForm();

    readonly permissionTree = computed(() => {
        const item = this.item();
        const permissions = this.permissions();

        return this.isEditMode()
            ? this.treeService.transformPermissionsToTree(
                  item?.permissions ?? []
              )
            : this.treeService.transformPermissionsToTree(
                  permissions?.props?.permissions ?? []
              );
    });

    readonly selectedCount = computed(
        () => this.treeService.countLeafNodes(this.selectedNodes()).size
    );

    constructor() {
        effect(() => {
            const item = this.item();

            if (!item) {
                return;
            }

            this.form.patchValue(
                {
                    name: item.name,
                    description: item.description,
                },
                { emitEvent: false }
            );
        });

        effect(() => {
            const tree = this.permissionTree();

            this.selectedNodes.set(this.treeService.collectCheckedNodes(tree));
        });
    }

    private createForm(): FormGroup<TeamsFormControls> {
        return this.fb.nonNullable.group<TeamsFormControls>({
            code: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.CODE.MIN),
                    Validators.maxLength(FormValidators.CODE.MAX),
                    Validators.pattern(FormValidators.CODE.PATTERN),
                ],
            }),
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
            reportTypes: new FormControl([], {
                nonNullable: true,
                validators: [Validators.required],
            }),
            operators: new FormControl([], {
                nonNullable: true,
                validators: [Validators.required],
            }),
            permissions: new FormControl([], {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    private readonly patchItemEffect = effect(() => {
        const item = this.item();
        if (item && Object.keys(item).length > 0) {
            this.form.patchValue(
                {
                    code: item.code,
                    name: item.name,
                    description: item.description,
                    reportTypes: item.reportTypes || [],
                    operators: item.operators || [],
                },
                { emitEvent: false }
            );
            queueMicrotask(() => this.isPatching.set(false));
        }
    });

    public setMode(uniqId?: string): void {
        this.isEditMode.set(!!uniqId);

        this.form.reset();
        this.facade.reset();
        this.permissionsFacade.reset();

        if (uniqId) {
            this.facade.read({ uniqId }, true);
        } else {
            this.permissionsFacade.readAll();
        }
    }

    updateSelectedNodes(nodes: TreeNodeInterface[]): void {
        this.selectedNodes.set(nodes);

        const permissions = this.treeService.collectLeafKeysFromNodes(nodes);

        this.form.controls.permissions.setValue(permissions);
    }

    expandAll(): void {
        const expanded = this.treeService.expandAll(this.permissionTree());

        this.selectedNodes.set(this.treeService.collectCheckedNodes(expanded));
    }

    collapseAll(): void {
        const collapsed = this.treeService.collapseAll(this.permissionTree());

        this.selectedNodes.set(this.treeService.collectCheckedNodes(collapsed));
    }

    public resetForm(): void {
        this.form.reset();
        this.isEditMode.set(false);
        this.facade.reset();
    }
}
