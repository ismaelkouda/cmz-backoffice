import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Signal,
    DestroyRef,
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
import { FormValidators } from '@pages/team-organization/domain/validators/form-validators';
import { TEAMS_FORM_TABS } from '@presentation/pages/team-organization/presentation/adapters/teams/teams-form-tabs.constant';
import { TeamsFormStore } from '@presentation/pages/team-organization/presentation/store/teams/teams-form.store';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
    enumToFilterOptions,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ToastrService } from 'ngx-toastr';
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
import { map, switchMap } from 'rxjs';
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
    providers: [TeamsFormStore, FormValidationService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsFormComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly title = inject(Title);
    private readonly toast = inject(ToastrService);
    private readonly sweetAlert = inject(SweetAlertService);

    private readonly translate = inject(TranslateService);
    protected readonly formStore = inject(TeamsFormStore);

    protected readonly permissions = this.formStore.permissions;
    protected readonly loadingPermissions = this.formStore.loadingPermissions;
    protected readonly permissionTree = this.formStore.permissionTree;
    protected readonly selectedNodes = this.formStore.selectedNodes;
    protected readonly isEditMode = this.formStore.isEditMode;

    private readonly canCreate = this.permissionActions.can(
        '/organization/team',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/organization/team',
        'edit'
    );

    protected readonly tabs = TEAMS_FORM_TABS;
    private readonly validation = inject(FormValidationService);
    protected readonly VALIDATION = FormValidators;

    protected readonly reportTypeOptions: Signal<FilterOption[]> = computed(
        () => {
            return enumToFilterOptions(ReportType, this.t.bind(this));
        }
    );
    protected readonly operatorOptions: Signal<FilterOption[]> = computed(
        () => {
            return enumToFilterOptions(TelecomOperator, this.t.bind(this));
        }
    );
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
            ? 'TEAM_ORGANIZATION.TEAMS.FORM.TITLE_FORM_EDI'
            : 'TEAM_ORGANIZATION.TEAMS.FORM.TITLE_FORM_ADD'
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
    protected onTreeInteractions(): void {
        this.formStore.updateSelectedNodes(this.selectedNodes());
    }
    protected onExpandAll(): void {
        this.formStore.expandAll();
    }
    protected onCollapseAll(): void {
        this.formStore.collapseAll();
    }
    private showValidationErrors(): void {
        const controlNames = [
            // 'code',
            'name',
            'description',
            'reportTypes',
            'operators',
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
                'TEAM_ORGANIZATION.TEAMS.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('TEAM_ORGANIZATION.TEAMS.TOOLTIP.CREATE');
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t('TEAM_ORGANIZATION.TEAMS.TOOLTIP.NO_PERMISSION_EDIT');
        }
        return this.t('TEAM_ORGANIZATION.TEAMS.TOOLTIP.NOT_EDIT');
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
                ? 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.TITLE.EDIT'
                : 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.TITLE.CREATE',
            messageKey: isEdit
                ? 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.MESSAGE.EDIT'
                : 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.MESSAGE.CREATE',
            messageParams: {
                uniqId,
            },
        });
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }
}
