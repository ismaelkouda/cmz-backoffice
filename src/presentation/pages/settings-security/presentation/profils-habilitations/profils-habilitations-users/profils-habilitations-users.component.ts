import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    signal,
    Signal,
    TemplateRef,
    viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { map, Subject, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { SETTINGS_SECURITY_ROUTE } from '@shared/routes/routes';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';

import { DEPARTMENTS_ROUTE } from '@presentation/pages/administrative-boundary/administrative-boundary.route';
import { ProfilsHabilitationsUsersFacade } from '@presentation/pages/settings-security/core/application/services/profils-habilitations/profils-habilitations-users.facade';
import { ProfilesSelectFacade } from '@presentation/pages/settings-security/core/application/services/users/profiles-select.facade';
import { PROFILES_HABILITATIONS_USERS_TABLE_CONSTANT } from '@presentation/pages/settings-security/core/domain/constants/profils-habilitations/profils-habilitations-users-table.constant';
import { ProfilsHabilitationsUsersFilterControl } from '@presentation/pages/settings-security/core/domain/controls/profils-habilitations/profils-habilitations-users-filter.control';
import { ProfilsHabilitationsUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users.entity';

@Component({
    selector: 'app-profils-habilitations-users',
    standalone: true,
    templateUrl: './profils-habilitations-users.component.html',
    styleUrls: ['./profils-habilitations-users.component.scss'],
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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilsHabilitationsUsersComponent {
    private readonly title = inject(Title);
    public readonly facade = inject(ProfilsHabilitationsUsersFacade);
    public readonly profilesSelectFacade = inject(ProfilesSelectFacade);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly toastr = inject(ToastrService);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly modalService = inject(NgbModal);
    private readonly currentLang = signal<string>(this.translate.currentLang);
    private readonly destroy$ = new Subject<void>();
    public readonly tableConfig = PROFILES_HABILITATIONS_USERS_TABLE_CONSTANT;

    readonly selectionInputValue = signal<number | null>(null);

    readonly curentProfilHabilitation = toSignal(this.facade.items$, {
        initialValue: [],
    });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });
    readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.config.app.name
    );

    readonly profiles = toSignal(this.profilesSelectFacade.items$, {
        initialValue: [],
    });

    readonly reassignModalTemplate =
        viewChild<TemplateRef<unknown>>('reassignModal');
    public reassignForm: FormGroup = this.fb.group({
        profile: [null, [Validators.required]],
    });

    public readonly selectedUsers = signal<ProfilsHabilitationsUsersEntity[]>(
        []
    );

    public readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.REASSIGN',
            actionId: 'reassign',
            class: 'btn-warning',
            icon: 'pi pi-user-edit',
            translateKey:
                'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.REASSIGN',
            disabled: this.selectedUsers().length === 0,
        },
        {
            label: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.REMOVE',
            actionId: 'remove',
            class: 'btn-danger',
            icon: 'pi pi-trash',
            translateKey:
                'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.REMOVE',
            disabled: this.selectedUsers().length === 0,
        },
    ]);

    private readonly paramsUniqId: Signal<string> = toSignal(
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

    readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();

        return [
            {
                type: 'text',
                name: 'search',
                label: this.t(
                    'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.FILTER.SEARCH'
                ),
                placeholder: this.t(
                    'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.FILTER.SEARCH_PLACEHOLDER'
                ),
                translationKeys: {
                    label: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.FILTER.SEARCH',
                    placeholder:
                        'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'userEmail',
                label: this.t(
                    'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.FILTER.EMAIL'
                ),
                placeholder: this.t(
                    'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.FILTER.EMAIL_PLACEHOLDER'
                ),
                translationKeys: {
                    label: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.FILTER.EMAIL',
                    placeholder:
                        'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.FILTER.EMAIL_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'phone',
                label: this.t(
                    'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.FILTER.PHONE'
                ),
                placeholder: this.t(
                    'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.FILTER.PHONE_PLACEHOLDER'
                ),
                translationKeys: {
                    label: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.FILTER.PHONE',
                    placeholder:
                        'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.FILTER.PHONE_PLACEHOLDER',
                },
            },
        ];
    });

    public formFilter: FormGroup<ProfilsHabilitationsUsersFilterControl> =
        this.fb.group<ProfilsHabilitationsUsersFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            userEmail: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            phone: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
        });

    constructor() {
        const uniqId = this.paramsUniqId();
        if (uniqId) {
            this.facade.reset();
            this.facade.readAll({ uniqId });
        } else {
            this.facade.reset();
            this.formFilter.reset();
        }
        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });

        effect(() => {
            this.filterFields();
        });

        this.profilesSelectFacade.readAll();
    }

    ngOnInit(): void {
        this.title.setTitle(
            this.t('SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.PAGE_TITLE')
        );

        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.title.setTitle(
                    this.t(
                        'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.PAGE_TITLE'
                    )
                );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.modalService.dismissAll();
    }

    public onFilter(filterValue: any): void {
        if (!this.paramsUniqId()) {
            return;
        }
        const filter = {
            ...filterValue,
            uniqId: this.paramsUniqId(),
        };
        this.facade.readAll(filter, '1', true);
    }

    public onPageChange(event: number): void {
        if (this.paramsUniqId()) {
            this.facade.changePage(event + 1);
        }
    }

    public onRefresh(): void {
        this.formFilter.reset();
        this.facade.refresh();
        this.selectedUsers.set([]);
    }

    public onPageChanged(page: number): void {
        this.facade.changePage(page + 1);
    }

    public onExportExcel(): void {
        const items = this.curentProfilHabilitation();
        if (!items.length) {
            this.toastr.error(this.t('EXPORT.NO_DATA'));
            return;
        }

        this.exportService.exportAsExcelFile(
            items,
            this.tableConfig,
            `${this.exportFilePrefix}-profils-habilitations-users`
        );
    }

    public onHeaderButtonClicked(actionId: string): void {
        if (actionId === 'reassign') {
            this.openReassignModal();
        } else if (actionId === 'remove') {
            this.onRemoveUsers();
        }
    }

    public onSelectionChange(selection: any | any[]): void {
        const users = Array.isArray(selection) ? selection : [selection];
        this.selectedUsers.set(users.filter((u) => !!u));
    }

    private openReassignModal(): void {
        const template = this.reassignModalTemplate();
        if (template) {
            this.reassignForm.reset();
            this.modalService.open(template, {
                centered: true,
                backdrop: 'static',
                keyboard: false,
            });
        }
    }

    public closeReassignModal(): void {
        this.modalService.dismissAll();
        this.reassignForm.reset();
    }

    public onSubmitReassign(): void {
        if (this.reassignForm.invalid) {
            this.reassignForm.markAllAsTouched();
            return;
        }

        const profileId = this.reassignForm.value.profile;
        const uniqId = this.paramsUniqId();
        const users = this.selectedUsers().map((u) => u.uniqId);

        if (!uniqId || users.length === 0) {
            return;
        }

        this.facade
            .reassign({
                uniqId: profileId,
                users,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.closeReassignModal();
                this.selectedUsers.set([]);
                this.facade.refresh();
            });
    }

    private onRemoveUsers(): void {
        const uniqId = this.paramsUniqId();
        const users = this.selectedUsers().map((u) => u.uniqId);

        if (!uniqId || users.length === 0) {
            return;
        }

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.SWEET_ALERT.REMOVE_TITLE'
            ),
            text: this.translate.instant(
                'SETTINGS_SECURITY.PROFILES_HABILITATIONS_USERS.SWEET_ALERT.REMOVE_MESSAGE',
                { count: users.length }
            ),
            confirmButtonText: this.translate.instant('COMMON.CONFIRM'),
            cancelButtonText: this.translate.instant('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade
                    .remove({
                        uniqId,
                        users,
                    })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.selectedUsers.set([]);
                    });
            }
        });
    }

    private t(key: string, params?: object) {
        return this.translate.instant(key, params);
    }

    private normalizeExportPrefix(name: string): string {
        return (
            name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '') || 'cmz'
        );
    }

    public trackByUniqId(
        _index: number,
        item: ProfilsHabilitationsUsersEntity
    ): string {
        return item.uniqId;
    }

    public getCurrentLanguage(): string {
        return this.currentLang();
    }

    public onCancel(): void {
        this.router.navigate([
            `${SETTINGS_SECURITY_ROUTE}/${DEPARTMENTS_ROUTE}`,
        ]);
    }
}
