import { CommonModule, DatePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    Signal,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Event, Params, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
    enumToFilterOptions,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { PROCESSING_ROUTE } from '@shared/routes/routes';

import { TasksActionsFacade } from '@presentation/pages/processing/application/services/tasks/tasks-actions.facade';
import { TASKS_ACTIONS_TABLE } from '@presentation/pages/processing/domain/constants/tasks/tasks-actions-table.constant';
import { TasksActionsFormControl } from '@presentation/pages/processing/domain/controls/tasks/tasks-actions-form.control';
import { TasksActionsTypes } from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-types.enum';
import { TASKS_ROUTE } from '@presentation/pages/processing/processing.routes';

@Component({
    selector: 'app-actions-treatment',
    standalone: true,
    templateUrl: './actions-treatment.component.html',
    styleUrls: ['./actions-treatment.component.scss'],
    imports: [
        CommonModule,
        TranslateModule,
        PageTitleComponent,
        PaginationComponent,
        TableComponent,
        ButtonModule,
        BreadcrumbComponent,
        TagModule,
        ReactiveFormsModule,
        TranslateModule,
        DialogModule,
        SelectModule,
        ButtonModule,
        InputGroupModule,
        InputTextModule,
        InputGroupAddonModule,
        TextareaModule,
        DatePickerModule,
        ToggleSwitchModule,
    ],
    providers: [DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsTreatmentComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly facade = inject(TasksActionsFacade);
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
    public readonly tableConfig = TASKS_ACTIONS_TABLE;
    private lastSuccess = this.facade.actionSuccess();
    public readonly displayModal = signal<boolean>(false);
    private readonly openRequested = signal(false);

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

    public readonly uniqId: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => params['uniqId'])
        ),
        { initialValue: '' }
    );

    public readonly paramsTypeReport: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => params['typeReport'])
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

        this.lastSuccess = current;
        this.navigateToBack();
    });

    private readonly modalEffect = effect(() => {
        if (!this.openRequested()) {
            return;
        }
        this.form.reset();
        this.displayModal.set(true);
        this.openRequested.set(false);
    });

    private readonly langChange = toSignal(
        this.translate.onLangChange.pipe(map((e) => e.lang)),
        { initialValue: this.translate.getCurrentLang() }
    );

    private readonly pageTitleEffect = effect(() => {
        this.langChange();
        this.title.setTitle(this.t('PROCESSING.TASKS.ACTIONS.PAGE_TITLE'));
    });

    readonly form = this.fb.group<TasksActionsFormControl>({
        date: new FormControl<string>('', {
            nonNullable: true,
        }),
        type: new FormControl<string>('', {
            nonNullable: true,
        }),
        description: new FormControl<string>('', {
            nonNullable: true,
        }),
        shouldNotifyUser: new FormControl<boolean>(false, {
            nonNullable: true,
        }),
    });

    public readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.CREATE',
            actionId: 'create',
            class: 'btn-primary',
            icon: 'pi pi-user-plus',
            translateKey: 'COMMON.CREATE',
        },
    ]);

    readonly actionsTypesOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(
            TasksActionsTypes,
            this.t.bind(this),
            'toUpperCase'
        );
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

    public onPageChange(event: number): void {
        if (this.uniqId()) {
            this.facade.changePage(JSON.stringify(event + 1));
        }
    }

    public onRefreshClicked(): void {
        this.form.reset();
        this.facade.refresh();
        this.form.reset();
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
            `${this.exportFilePrefix}-teams-participants`
        );
    }

    public onHeaderButtonClicked(actionId: string): void {
        if (actionId === 'create') {
            this.openModal();
        }
    }

    private openModal(): void {
        this.openRequested.set(true);
    }

    public closeModal(): void {
        this.displayModal.set(false);
        this.form.reset();
    }

    public onSubmitForm(): void {
        if (this.form.invalid || !this.uniqId()) {
            return;
        }
        this.facade.create({
            reportUniqId: this.uniqId(),
            ...this.form.getRawValue(),
        });
    }

    public onEditClicked(event: Event): void {
        if (this.form.invalid || !this.uniqId()) {
            return;
        }
        /* this.facade.create({
            reportUniqId: this.uniqId(),
            uniqId: event.uniqId,
            ...this.form.getRawValue(),
        }); */
        console.log(event);
    }

    public onDeleteClicked(event: Event): void {
        if (!this.uniqId()) {
            return;
        }
        console.log('event', event);

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.SWEET_ALERT.TITLE_REMOVE'
            ),
            text: this.t(
                'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.SWEET_ALERT.MESSAGE_REMOVE'
            ),
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.delete({
                    uniqId: this.uniqId(),
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
        this.router.navigate([PROCESSING_ROUTE + '/' + TASKS_ROUTE]);
    }
}
