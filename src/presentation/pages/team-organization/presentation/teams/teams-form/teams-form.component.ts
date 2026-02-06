import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Signal,
    DestroyRef,
    effect,
    signal,
    WritableSignal,
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
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
import { PermissionTreeService } from '@shared/services/permission-tree-node.service';

import { TeamsFindOneFacade } from '@presentation/pages/team-organization/application/services/teams/teams-findone.facade';
import { TeamsPermissionsFacade } from '@presentation/pages/team-organization/application/services/teams/teams-permissions.facade';
import { TeamsFacade } from '@presentation/pages/team-organization/application/services/teams/teams.facade';
import { TEAMS_FORM_TABS } from '@presentation/pages/team-organization/domain/constants/teams/teams-form-tabs.constant';
import { TeamsFormControls } from '@presentation/pages/team-organization/domain/controls/teams/teams-form.control';
import { FormValidators } from '@presentation/pages/team-organization/domain/validators/form-validators';
import { TeamsFormHelperService } from '@presentation/pages/team-organization/presentation/teams/teams-form/teams-form-helper.service';
import { TeamsFormValidationService } from '@presentation/pages/team-organization/presentation/teams/teams-form/teams-form-validation.service';

@Component({
    selector: 'app-teams-form',
    templateUrl: './teams-form.component.html',
    styleUrls: ['./teams-form.component.scss'],
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
        CheckboxModule,
        ButtonModule,
        TagModule,
        ToastModule,
        TooltipModule,
        TabsModule,
        TreeModule,
    ],
    providers: [
        TeamsFormHelperService,
        PermissionTreeService,
        TeamsFormValidationService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsFormComponent {
    public readonly tabs = TEAMS_FORM_TABS;
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly submitFacade = inject(TeamsFacade);
    private readonly facade = inject(TeamsFindOneFacade);
    private readonly permissionsFacade = inject(TeamsPermissionsFacade);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly validationService = inject(TeamsFormValidationService);
    public readonly treeService = inject(PermissionTreeService);
    private readonly helperService = inject(TeamsFormHelperService);
    readonly VALIDATION = FormValidators;
    readonly items = toSignal(this.facade.item$, { initialValue: null });
    readonly permissions = toSignal(this.permissionsFacade.items$, {
        initialValue: null,
    });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly loadingPermissions = toSignal(this.permissionsFacade.isLoading$, {
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
    readonly leafCount: WritableSignal<number> = signal(0);

    private readonly updatePermissionTree = effect(
        () => {
            const item = this.items();
            const permissions = this.permissions();
            const tree = this.paramsUniqId()
                ? item?.permissions
                    ? this.treeService.transformPermissionsToTree(
                          item.permissions
                      )
                    : []
                : this.treeService.transformPermissionsToTree(
                      permissions?.props?.permissions ?? []
                  );
            this.permissionTree.set(tree);
        },
        { allowSignalWrites: true }
    );
    public selectedNodes: TreeNodeInterface[] = [];

    readonly reportTypeOptions = signal([
        {
            label: 'TEAM_ORGANIZATION.TEAMS.FORM.TABS.PERMISSIONS.FIELDSET_REPORT_TYPES.ZOB',
            value: 'zob',
        },
        {
            label: 'TEAM_ORGANIZATION.TEAMS.FORM.TABS.PERMISSIONS.FIELDSET_REPORT_TYPES.ABI',
            value: 'abi',
        },
        {
            label: 'TEAM_ORGANIZATION.TEAMS.FORM.TABS.PERMISSIONS.FIELDSET_REPORT_TYPES.CPS',
            value: 'cps',
        },
        {
            label: 'TEAM_ORGANIZATION.TEAMS.FORM.TABS.PERMISSIONS.FIELDSET_REPORT_TYPES.CPO',
            value: 'cpo',
        },
    ]);

    readonly operatorOptions = signal([
        {
            label: 'TEAM_ORGANIZATION.TEAMS.FORM.TABS.PERMISSIONS.FIELDSET_OPERATORS.MTN',
            value: 'mtn',
        },
        {
            label: 'TEAM_ORGANIZATION.TEAMS.FORM.TABS.PERMISSIONS.FIELDSET_OPERATORS.ORANGE',
            value: 'orange',
        },
        {
            label: 'TEAM_ORGANIZATION.TEAMS.FORM.TABS.PERMISSIONS.FIELDSET_OPERATORS.MOOV',
            value: 'moov',
        },
    ]);

    readonly form: FormGroup<TeamsFormControls> =
        this.fb.nonNullable.group<TeamsFormControls>({
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

    private readonly patchFormFromItem = effect(
        () => {
            const item = this.items();
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
                this.permissionsFacade.reset();
                this.facade.read({ uniqId }, true);
            } else {
                this.facade.reset();
                this.form.reset();
                this.permissionsFacade.readAll();
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
        this.leafCount.set(
            this.treeService.countLeafNodes(this.selectedNodes).size
        );
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
                    'TEAM_ORGANIZATION.TEAMS.FORM.VALIDATION.PERMISSIONS_REQUIRED'
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

        const title = this.helperService.getSweetAlertTitle(this.isEditMode());
        const message = this.helperService.getSweetAlertMessage(
            this.isEditMode()
        );

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
                    },
                });
        }
    }

    onCancel(): void {
        this.helperService.navigateToTeamsList();
    }
}
