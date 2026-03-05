import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    signal,
    Signal,
    OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { Roles } from '@shared/domain/enums/roles.enum';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { SETTINGS_SECURITY_ROUTE } from '@shared/routes/routes';

import { ProfilesPermissionsSelectFacade } from '@presentation/pages/settings-security/application/services/profiles-permissions/profiles-permissions-select.facade';
import { ProfilesPermissionsUsersFacade } from '@presentation/pages/settings-security/application/services/profiles-permissions/profiles-permissions-users.facade';
import { UsersSelectFacade } from '@presentation/pages/settings-security/application/services/users/users-select.facade';
import { PROFILES_PERMISSIONS_USERS } from '@presentation/pages/settings-security/domain/constants/profiles-permissions/profiles-permissions-users-table.constant';
import { ProfilesPermissionsUsersFilterControl } from '@presentation/pages/settings-security/domain/controls/profiles-permissions/profiles-permissions-users-filter.control';
import { ProfilesPermissionsUsersEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users.entity';
import { PROFILES_PERMISSIONS_ROUTE } from '@presentation/pages/settings-security/settings-security.routes';

@Component({
    selector: 'app-profiles-permissions-users',
    standalone: true,
    templateUrl: './profiles-permissions-users.component.html',
    styleUrls: ['./profiles-permissions-users.component.scss'],
    imports: [
        CommonModule,
        PageTitleComponent,
        BreadcrumbComponent,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        TranslateModule,
        ButtonModule,
        TagModule,
        SelectModule,
        ReactiveFormsModule,
        DialogModule,
        MultiSelectModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilesPermissionsUsersComponent implements OnInit {
    private readonly title = inject(Title);
    public readonly facade = inject(ProfilesPermissionsUsersFacade);
    public readonly profilesPermissionsSelectFacade = inject(
        ProfilesPermissionsSelectFacade
    );
    public readonly usersSelectFacade = inject(UsersSelectFacade);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    public readonly tableConfig = PROFILES_PERMISSIONS_USERS;
    private lastSuccess = this.facade.actionSuccess();

    readonly items = toSignal(this.facade.items$, {
        initialValue: [],
    });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.config.app.name
    );

    readonly profiles = toSignal(this.profilesPermissionsSelectFacade.items$, {
        initialValue: [],
    });
    readonly loadingTeams = toSignal(
        this.profilesPermissionsSelectFacade.isLoading$,
        {
            initialValue: false,
        }
    );
    readonly users = toSignal(this.usersSelectFacade.items$, {
        initialValue: [],
    });
    readonly loadingUsers = toSignal(this.usersSelectFacade.isLoading$, {
        initialValue: false,
    });

    public readonly displayReassignModal = signal<boolean>(false);
    private readonly openReassignRequested = signal<boolean>(false);

    public readonly displayAssignModal = signal<boolean>(false);
    private readonly openAssignRequested = signal<boolean>(false);

    private readonly uniqId: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => params['uniqId'])
        ),
        { initialValue: '' }
    );

    public readonly paramsName: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => params['name'])
        ),
        { initialValue: '' }
    );

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
        this.closeAssignModal();
        this.closeReassignModal();
        this.usersSelectedInTable.set([]);
        this.lastSuccess = current;
    });

    private readonly reassignModalEffect = effect(() => {
        if (!this.openReassignRequested()) {
            return;
        }
        this.reassignForm.reset();
        this.displayReassignModal.set(true);
        this.openReassignRequested.set(false);
    });

    private readonly assignModalEffect = effect(() => {
        if (!this.openAssignRequested()) {
            return;
        }
        this.assignForm.reset();
        this.displayAssignModal.set(true);
        this.openAssignRequested.set(false);
    });

    private readonly langChange = toSignal(
        this.translate.onLangChange.pipe(map((e) => e.lang)),
        { initialValue: this.translate.getCurrentLang() }
    );

    private readonly pageTitleEffect = effect(() => {
        this.langChange();
        this.title.setTitle(
            this.t('SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.PAGE_TITLE')
        );
    });

    public reassignForm: FormGroup = this.fb.group({
        team: [null, [Validators.required]],
    });

    public assignForm: FormGroup = this.fb.group({
        users: [null, [Validators.required]],
    });

    public readonly usersSelectedInTable = signal<
        ProfilesPermissionsUsersEntity[]
    >([]);

    public readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.ASSIGN',
            actionId: 'assign',
            type: 'splitbutton',
            class: 'btn-primary',
            icon: 'pi pi-user-plus',
            translateKey: 'COMMON.ASSIGN',
            items: this.buildAssignMenuItems(),
            disabled: this.usersSelectedInTable().length >= 1,
        },
        {
            label: 'COMMON.REASSIGN',
            actionId: 'reassign',
            class: 'btn-warning',
            icon: 'pi pi-user-edit',
            translateKey: 'COMMON.REASSIGN',
            disabled: this.usersSelectedInTable().length === 0,
        },
        {
            label: 'COMMON.REMOVE',
            actionId: 'remove',
            class: 'btn-danger',
            icon: 'pi pi-trash',
            translateKey: 'COMMON.REMOVE',
            disabled: this.usersSelectedInTable().length === 0,
        },
    ]);

    private buildAssignMenuItems(): MenuItem[] {
        return Object.entries(Roles).map(([key, translationKey]) => ({
            label: this.t(translationKey),
            command: () => this.onAssignRoleSelected(key.toLowerCase()),
        }));
    }

    private onAssignRoleSelected(role: string): void {
        console.log('role: ', role);
        this.openAssignRequested.set(true);
        this.usersSelectFacade.readAll(true);
    }

    readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();

        return [
            {
                type: 'text',
                name: 'search',
                label: this.t(
                    'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.FILTER.SEARCH'
                ),
                placeholder: this.t(
                    'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.FILTER.SEARCH_PLACEHOLDER'
                ),
                translationKeys: {
                    label: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.FILTER.SEARCH',
                    placeholder:
                        'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.FILTER.SEARCH_PLACEHOLDER',
                },
            },
        ];
    });

    public form: FormGroup<ProfilesPermissionsUsersFilterControl> =
        this.fb.group<ProfilesPermissionsUsersFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
        });

    ngOnInit(): void {
        this.activatedRoute.queryParams
            .pipe(
                map((p) => (p['uniqId'] as string) || ''),
                tap((uniqId) => {
                    this.facade.reset();
                    if (uniqId) {
                        this.facade.readAll({ uniqId }, '1', true);
                    } else {
                        this.form.reset();
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    public onFilter(filterValue: any): void {
        if (!this.uniqId()) {
            return;
        }
        const filter = {
            ...filterValue,
            uniqId: this.uniqId(),
        };
        this.facade.readAll(filter, '1', true);
    }

    public onPageChange(event: number): void {
        if (this.uniqId()) {
            this.facade.changePage(JSON.stringify(event + 1));
        }
    }

    public onRefresh(): void {
        this.form.reset();
        this.facade.refresh();
        this.usersSelectedInTable.set([]);
        this.assignForm.reset();
        this.reassignForm.reset();
    }

    public onExportExcel(): void {
        const items = this.items();
        if (!items.length) {
            this.toast.error(this.t('EXPORT.NO_DATA'));
            return;
        }

        this.exportService.exportAsExcelFile(
            items,
            this.tableConfig,
            `${this.exportFilePrefix}-profiles-permissions-users`
        );
    }

    public onHeaderButtonClicked(actionId: string): void {
        if (actionId === 'reassign') {
            this.openReassignModal();
        } else if (actionId === 'remove') {
            this.onRemoveUsers();
        }
    }

    public onSelectionChange(
        selection:
            | ProfilesPermissionsUsersEntity
            | ProfilesPermissionsUsersEntity[]
    ): void {
        const users = Array.isArray(selection) ? selection : [selection];
        this.usersSelectedInTable.set(users.filter((u) => !!u));
    }

    private openReassignModal(): void {
        this.openReassignRequested.set(true);
        this.profilesPermissionsSelectFacade.readAll(true);
    }

    public closeReassignModal(): void {
        this.displayReassignModal.set(false);
        this.reassignForm.reset();
    }

    public closeAssignModal(): void {
        this.displayAssignModal.set(false);
        this.assignForm.reset();
    }

    public onSubmitReassign(): void {
        if (this.reassignForm.invalid || !this.uniqId()) {
            return;
        }
        this.facade.reassign({
            uniqId: this.reassignForm.get('team')?.value,
            users: this.usersSelectedInTable().map((p) => p.uniqId),
        });
    }

    public onSubmitAssign(): void {
        if (this.assignForm.invalid || !this.uniqId()) {
            return;
        }
        this.facade.assign({
            uniqId: this.uniqId(),
            ...this.assignForm.getRawValue(),
        });
    }

    private onRemoveUsers(): void {
        if (!this.uniqId() || this.usersSelectedInTable().length === 0) {
            return;
        }

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.SWEET_ALERT.TITLE_REMOVE'
            ),
            text: this.t(
                'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.SWEET_ALERT.MESSAGE_REMOVE'
            ),
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.remove({
                    uniqId: this.uniqId(),
                    users: this.usersSelectedInTable().map((p) => p.uniqId),
                });
            }
        });
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    private normalizeExportPrefix(name: string): string {
        return (
            name
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }

    public getCurrentLanguage(): string {
        return this.currentLang();
    }

    navigateToBack(): void {
        this.router.navigate([
            SETTINGS_SECURITY_ROUTE + '/' + PROFILES_PERMISSIONS_ROUTE,
        ]);
    }
}
