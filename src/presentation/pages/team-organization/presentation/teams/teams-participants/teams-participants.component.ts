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
import {
    ActivatedRoute,
    Params,
    Router,
} from '@angular/router';
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
import { TEAM_ORGANIZATION_ROUTE } from '@shared/routes/routes';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';

import { TeamsParticipantsFacade } from '@presentation/pages/team-organization/application/services/teams/teams-participants.facade';
import { TEAMS_PARTICIPANTS_TABLE_CONSTANT } from '@presentation/pages/team-organization/domain/constants/teams/teams-participants-table.constant';
import { TeamsParticipantsFilterControl } from '@presentation/pages/team-organization/domain/controls/teams/teams-participants-filter.control';
import { TeamsParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants.entity';
import { TEAMS_ROUTE } from '@presentation/pages/team-organization/team-organization.routes';
import { TeamsSelectFacade } from '@presentation/pages/team-organization/application/services/teams/teams-select.facade';

@Component({
    selector: 'app-teams-participants',
    standalone: true,
    templateUrl: './teams-participants.component.html',
    styleUrls: ['./teams-participants.component.scss'],
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
export class TeamsParticipantsComponent {
    private readonly title = inject(Title);
    public readonly facade = inject(TeamsParticipantsFacade);
    public readonly teamsSelectFacade = inject(TeamsSelectFacade);
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
    public readonly tableConfig = TEAMS_PARTICIPANTS_TABLE_CONSTANT;

    readonly selectionInputValue = signal<number | null>(null);

    readonly curentTeamsParticipants = toSignal(this.facade.items$, {
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

    readonly teams = toSignal(this.teamsSelectFacade.items$, {
        initialValue: [],
    });

    readonly reassignModalTemplate =
        viewChild<TemplateRef<unknown>>('reassignModal');
    public reassignForm: FormGroup = this.fb.group({
        team: [null, [Validators.required]],
    });

    public readonly selectedParticipants = signal<TeamsParticipantsEntity[]>(
        []
    );

    public readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TABLE.BUTTONS.REASSIGN',
            actionId: 'reassign',
            class: 'btn-warning',
            icon: 'pi pi-user-edit',
            translateKey: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TABLE.BUTTONS.REASSIGN',
            disabled: this.selectedParticipants().length === 0,
        },
        {
            label: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TABLE.BUTTONS.REMOVE',
            actionId: 'remove',
            class: 'btn-danger',
            icon: 'pi pi-trash',
            translateKey: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TABLE.BUTTONS.REMOVE',
            disabled: this.selectedParticipants().length === 0,
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
                    'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.SEARCH'
                ),
                placeholder: this.t(
                    'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.SEARCH_PLACEHOLDER'
                ),
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.SEARCH',
                    placeholder:
                        'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'userEmail',
                label: this.t(
                    'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.EMAIL'
                ),
                placeholder: this.t(
                    'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.EMAIL_PLACEHOLDER'
                ),
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.EMAIL',
                    placeholder:
                        'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.EMAIL_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'phone',
                label: this.t(
                    'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.PHONE'
                ),
                placeholder: this.t(
                    'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.PHONE_PLACEHOLDER'
                ),
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.PHONE',
                    placeholder:
                        'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.PHONE_PLACEHOLDER',
                },
            },
        ];
    });

    public formFilter: FormGroup<TeamsParticipantsFilterControl> =
        this.fb.group<TeamsParticipantsFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            participantEmail: new FormControl<string | undefined>(undefined, {
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

        this.teamsSelectFacade.readAll();
    }

    ngOnInit(): void {
        this.title.setTitle(
            this.t('TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.PAGE_TITLE')
        );

        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.PAGE_TITLE')
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
        this.selectedParticipants.set([]);
    }

    public onPageChanged(page: number): void {
        this.facade.changePage(page + 1);
    }

    public onExportExcel(): void {
        const items = this.curentTeamsParticipants();
        if (!items.length) {
            this.toastr.error(this.t('EXPORT.NO_DATA'));
            return;
        }

        this.exportService.exportAsExcelFile(
            items,
            this.tableConfig,
            `${this.exportFilePrefix}-teams-participants`
        );
    }

    public onHeaderButtonClicked(actionId: string): void {
        if (actionId === 'reassign') {
            this.openReassignModal();
        } else if (actionId === 'remove') {
            this.onRemoveParticipants();
        }
    }

    public onSelectionChange(selection: any | any[]): void {
        const participants = Array.isArray(selection) ? selection : [selection];
        this.selectedParticipants.set(participants.filter((u) => !!u));
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
        if (this.reassignForm.invalid || !this.paramsUniqId()) return;
    
        this.facade.reassign({
            uniqId: this.paramsUniqId(),
            participants: this.selectedParticipants().map(p => p.uniqId)
        });
    
        this.closeReassignModal();
    }
    

    private onRemoveParticipants(): void {
        const uniqId = this.paramsUniqId();
        const participants = this.selectedParticipants().map((u) => u.uniqId);

        if (!uniqId || participants.length === 0) {
            return;
        }

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.SWEET_ALERT.TITLE_REMOVE'
            ),
            text: this.translate.instant(
                'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.SWEET_ALERT.MESSAGE_REMOVE',
                { count: participants.length }
            ),
            confirmButtonText: this.translate.instant('COMMON.CONFIRM'),
            cancelButtonText: this.translate.instant('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade
                    .remove({
                        uniqId,
                        participants,
                    })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.selectedParticipants.set([]);
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
        item: TeamsParticipantsEntity
    ): string {
        return item.uniqId;
    }

    public getCurrentLanguage(): string {
        return this.currentLang();
    }

    public onCancel(): void {
        this.router.navigate([
            `${TEAM_ORGANIZATION_ROUTE}/${TEAMS_ROUTE}`,
        ]);
    }
}
