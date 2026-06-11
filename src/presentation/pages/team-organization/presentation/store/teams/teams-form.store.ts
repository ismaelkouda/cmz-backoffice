import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { TeamsFindOneFacade } from '@pages/team-organization/application/services/teams/teams-find-one.facade';
import { TeamsPermissionsFacade } from '@pages/team-organization/application/services/teams/teams-permissions.facade';
import { TeamsFacade } from '@pages/team-organization/application/services/teams/teams.facade';
import { TeamsFormControls } from '@pages/team-organization/domain/controls/teams/teams-form.control';
import { TeamsFormHelperService } from '@pages/team-organization/domain/services/teams/teams-form-helper.service';
import { FormValidators } from '@pages/team-organization/domain/validators/form-validators';
import { TeamsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-find-one.entity';
import { TreeNodeEntity } from '@shared/domain/entities/tree-node.entity';
import { TreeNodeInterface } from '@shared/domain/interfaces/tree-node.interface';
import { PermissionTreeService } from '@shared/domain/services/permission-tree-node.service';
import { startWith } from 'rxjs';

export type FormMode = 'create' | 'edit' | 'view';

@Injectable()
export class TeamsFormStore {
    private readonly fb = inject(FormBuilder);

    private readonly facade = inject(TeamsFindOneFacade);

    private readonly submitFacade = inject(TeamsFacade);

    private readonly permissionsFacade = inject(TeamsPermissionsFacade);

    private readonly helper = inject(TeamsFormHelperService);

    private readonly treeService = inject(PermissionTreeService);

    private readonly item = this.facade.items;

    public readonly loading = this.facade.loading;

    public readonly permissions = this.permissionsFacade.items;

    public readonly loadingPermissions = this.permissionsFacade.loading;

    private readonly createInitialized = signal(false);

    private readonly editInitialized = signal(false);

    private readonly editingId = signal<string | null>(null);

    private readonly formMode = signal<FormMode>('create');

    public readonly selectedNodes = signal<TreeNodeInterface[]>([]);

    public readonly permissionTree = signal<TreeNodeInterface[]>([]);

    private readonly initialValue = {
        name: '',
        description: '',
        reportTypes: [],
        operators: [],
        permissions: [],
    };

    public readonly form: FormGroup<TeamsFormControls> =
        this.fb.nonNullable.group<TeamsFormControls>({
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

    public readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        {
            initialValue: this.form.status,
        }
    );

    public readonly isSubmitting = computed(
        () => this.submitFacade.actionState() === 'loading'
    );

    public readonly isValid = computed(() => this.status() === 'VALID');

    public readonly isCreateMode = computed(() => this.formMode() === 'create');

    public readonly isEditMode = computed(() => this.formMode() === 'edit');

    public readonly isViewMode = computed(() => this.formMode() === 'view');

    constructor() {
        this.initializeFormEffect();

        this.initializeDisableFormEffect();

        this.initializeSubmitSuccessEffect();
    }

    private initializeFormEffect(): void {
        effect(() => {
            const mode = this.formMode();

            if (mode === 'create') {
                const permissions = this.permissions();

                if (!permissions || this.createInitialized()) {
                    return;
                }

                this.setPermissionTree(
                    permissions.props?.permissions as TreeNodeEntity[]
                );

                this.createInitialized.set(true);

                return;
            }

            const item = this.item();
            console.log('item: ', item);

            if (!item || this.editInitialized()) {
                return;
            }

            this.patchForm(item);

            this.setPermissionTree(item.permissions);

            this.editInitialized.set(true);
        });
    }

    private initializeDisableFormEffect(): void {
        effect(() => {
            const shouldDisable = this.isViewMode() || this.isSubmitting();

            if (shouldDisable) {
                this.form.disable({
                    emitEvent: false,
                });

                return;
            }

            this.form.enable({
                emitEvent: false,
            });
        });
    }

    private initializeSubmitSuccessEffect(): void {
        effect(() => {
            const success = this.submitFacade.actionSuccess();

            if (success === 0) {
                return;
            }

            this.close();
        });
    }

    public openCreate(): void {
        this.submitFacade.resetActionSuccess();

        this.resetInternalState();

        this.formMode.set('create');

        this.editingId.set(null);

        this.permissionsFacade.readAll();
    }

    public openEdit(uniqId: string): void {
        console.log('uniqId: ', uniqId);
        this.submitFacade.resetActionSuccess();

        this.resetInternalState();

        this.formMode.set('edit');

        this.editingId.set(uniqId);

        this.facade.read({ uniqId });
    }

    public openView(uniqId: string): void {
        this.resetInternalState();

        this.formMode.set('view');

        this.editingId.set(uniqId);

        this.facade.read({ uniqId });
    }

    public close(): void {
        this.resetInternalState();

        this.formMode.set('create');

        this.editingId.set(null);

        this.facade.reset();

        this.permissionsFacade.reset();

        this.helper.navigateToTeamsList();
    }

    public reset(): void {
        this.form.reset(this.initialValue);

        this.permissionTree.set([]);

        this.selectedNodes.set([]);
    }

    public updateSelectedNodes(nodes: TreeNodeInterface[]): void {
        this.selectedNodes.set(nodes);

        const permissions = this.treeService.collectLeafKeysFromNodes(nodes);

        this.form.controls.permissions.setValue(permissions);
    }

    public expandAll(): void {
        const expanded = this.treeService.expandAll(this.permissionTree());

        this.permissionTree.set(expanded);
    }

    public collapseAll(): void {
        const collapsed = this.treeService.collapseAll(this.permissionTree());

        this.permissionTree.set(collapsed);
    }

    public submit(): void {
        if (this.form.invalid) {
            this.markFormAsTouched();

            return;
        }

        this.submitFacade.resetActionSuccess();

        const payload = this.form.getRawValue();

        const editingId = this.editingId();

        if (editingId) {
            this.submitFacade.update({
                uniqId: editingId,
                ...payload,
            });

            return;
        }

        this.submitFacade.create(payload);
    }

    private setPermissionTree(permissions: TreeNodeEntity[]): void {
        const tree = this.treeService.mapNodes(permissions ?? []);

        this.permissionTree.set(tree);

        this.initializeSelectedNodes(tree);
    }

    private patchForm(item: TeamsFindOneEntity): void {
        this.form.patchValue(
            {
                name: item.name ?? '',
                description: item.description ?? '',
                reportTypes: item.reportTypes ?? [],
                operators: item.operators ?? [],
            },
            {
                emitEvent: false,
            }
        );
    }

    private initializeSelectedNodes(tree: TreeNodeInterface[]): void {
        const checkedNodes = this.treeService.collectCheckedNodes(tree);

        this.selectedNodes.set(checkedNodes);

        const permissions =
            this.treeService.collectLeafKeysFromNodes(checkedNodes);

        this.form.controls.permissions.setValue(permissions);
    }

    private markFormAsTouched(): void {
        Object.values(this.form.controls).forEach((control) => {
            control.markAsTouched();
        });
    }

    private resetInternalState(): void {
        this.form.reset(this.initialValue);

        this.permissionTree.set([]);

        this.selectedNodes.set([]);

        this.createInitialized.set(false);

        this.editInitialized.set(false);
    }
}
