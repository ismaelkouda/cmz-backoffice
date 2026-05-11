import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Signal,
    effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TeamsFacade } from '@pages/team-organization/application/services/teams/teams.facade';
import { TeamsFormHelperService } from '@pages/team-organization/domain/services/teams/teams-form-helper.service';
import { FormValidators } from '@pages/team-organization/domain/validators/form-validators';
import { TEAMS_FORM_TABS } from '@presentation/pages/team-organization/presentation/adapters/teams/teams-form-tabs.constant';
import { TeamsFormStore } from '@presentation/pages/team-organization/presentation/store/teams/teams-form.store';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
    enumToFilterOptions,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
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
    providers: [TeamsFormStore, TeamsFormHelperService, FormValidationService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsFormComponent {
    public readonly tabs = TEAMS_FORM_TABS;
    readonly store = inject(TeamsFormStore);

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(TeamsFacade);
    private readonly helper = inject(TeamsFormHelperService);
    private readonly validation = inject(FormValidationService);

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

    readonly reportTypeOptions: Signal<FilterOption[]> = computed(() => {
        return enumToFilterOptions(ReportType, this.t.bind(this));
    });
    readonly operatorOptions: Signal<FilterOption[]> = computed(() => {
        return enumToFilterOptions(TelecomOperator, this.t.bind(this));
    });

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
        const controlNames = [
            // 'code',
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
        this.helper.navigateToTeamsList();
    }
}
