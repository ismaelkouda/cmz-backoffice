import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Signal,
    effect,
    signal,
    WritableSignal,
    OnInit,
    DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TeamsFindOneFacade } from '@pages/team-organization/application/services/teams/teams-find-one.facade';
import { TeamsPermissionsFacade } from '@pages/team-organization/application/services/teams/teams-permissions.facade';
import { TeamsFacade } from '@pages/team-organization/application/services/teams/teams.facade';
import { TEAMS_FORM_TABS } from '@pages/team-organization/domain/constants/teams/teams-form-tabs.constant';
import { TeamsFormControls } from '@pages/team-organization/domain/controls/teams/teams-form.control';
import { TeamsFormHelperService } from '@pages/team-organization/domain/services/teams/teams-form-helper.service';
import { FormValidators } from '@pages/team-organization/domain/validators/form-validators';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
    enumToFilterOptions,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { TreeNodeInterface } from '@shared/domain/interfaces/tree-node.interface';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
import { PermissionTreeService } from '@shared/domain/services/permission-tree-node.service';
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
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';

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
        FormValidationService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsFormComponent implements OnInit {
    public readonly tabs = TEAMS_FORM_TABS;
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly submitFacade = inject(TeamsFacade);
    private readonly facade = inject(TeamsFindOneFacade);
    private readonly permissionsFacade = inject(TeamsPermissionsFacade);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly validationService = inject(FormValidationService);
    public readonly treeService = inject(PermissionTreeService);
    private readonly helperService = inject(TeamsFormHelperService);
    readonly VALIDATION = FormValidators;
    private lastSuccess = this.submitFacade.actionSuccess();
    private itemPatched = false;
    readonly items = this.facade.items;
    readonly loading = this.facade.loading;
    private readonly paramsUniqId = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((p) => (p['uniqId'] as string) || '')
        ),
        { initialValue: '' }
    );
    readonly isEditMode = computed(() => !!this.paramsUniqId());
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

    readonly permissions = this.permissionsFacade.items;
    readonly loadingPermissions = this.permissionsFacade.loading;
    readonly permissionTree: WritableSignal<TreeNodeInterface[]> = signal([]);
    readonly leafCount: WritableSignal<number> = signal(0);

    private readonly updatePermissionTree = effect(() => {
        const item = this.items();
        const permissions = this.permissions();
        const tree = this.paramsUniqId()
            ? item?.permissions
                ? this.treeService.transformPermissionsToTree(item.permissions)
                : []
            : this.treeService.transformPermissionsToTree(
                  permissions?.props?.permissions ?? []
              );
        this.permissionTree.set(tree);
    });
    public selectedNodes: TreeNodeInterface[] = [];

    readonly reportTypeOptions: Signal<FilterOption[]> = computed(() => {
        return enumToFilterOptions(ReportType, this.t.bind(this));
    });

    readonly operatorOptions: Signal<FilterOption[]> = computed(() => {
        return enumToFilterOptions(TelecomOperator, this.t.bind(this));
    });

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

    private readonly patchFormFromItem = effect(() => {
        const item = this.items();
        if (item && Object.keys(item).length > 0 && !this.itemPatched) {
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
            this.itemPatched = true;
        }
    });

    private readonly initializeFormFromProfile = effect(() => {
        const treeNodes = this.permissionTree();
        if (treeNodes.length > 0) {
            const checkedNodes = this.collectCheckedNodes(treeNodes);
            this.selectedNodes = [...checkedNodes];
        } else {
            this.selectedNodes = [];
        }
    });

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

    ngOnInit(): void {
        this.activatedRoute.queryParams
            .pipe(
                map((p) => (p['uniqId'] as string) || ''),
                tap((uniqId) => {
                    if (uniqId) {
                        this.facade.reset();
                        this.permissionsFacade.reset();
                        this.facade.read({ uniqId }, true);
                    } else {
                        this.facade.reset();
                        this.form.reset();
                        this.permissionsFacade.readAll();
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

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
        const controlNames = [
            'code',
            'name',
            'description',
            'reportTypes',
            'operators',
        ] as const;

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
        const participant = this.form.getRawValue();
        if (this.isEditMode()) {
            this.submitFacade.update({
                uniqId: this.paramsUniqId(),
                ...participant,
            });
        } else {
            this.submitFacade.create(participant);
        }
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    navigateToBack(): void {
        this.helperService.navigateToTeamsList();
    }
}
