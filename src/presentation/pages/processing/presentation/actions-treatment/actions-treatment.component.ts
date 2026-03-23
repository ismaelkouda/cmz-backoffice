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
import {
    FormBuilder,
    FormControl,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DetailsFacade } from '@pages/processing/application/services/details/details.facade';
import { TasksActionsFacade } from '@pages/processing/application/services/tasks/tasks-actions.facade';
import { TASKS_ACTIONS_TABLE } from '@pages/processing/domain/constants/tasks/tasks-actions-table.constant';
import { TasksActionsFormControl } from '@pages/processing/domain/controls/tasks/tasks-actions-form.control';
import { TasksActionsEntity } from '@pages/processing/domain/entities/tasks/tasks-actions.entity';
import { TasksActionsTypes } from '@pages/processing/domain/enums/tasks/tasks-actions-types.enum';
import { TASKS_ROUTE } from '@pages/processing/processing.routes';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
    enumToFilterOptions,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { ManagementDialogComponent } from '@shared/components/management/presentation/management-dialog/management-dialog.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { operatorsTagStyle } from '@shared/domain/functions/operators-tag-style.function';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { PROCESSING_ROUTE } from '@shared/routes/routes';
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
        ManagementDialogComponent,
        TagModule,
        ReactiveFormsModule,
        DialogModule,
        SelectModule,
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
    private readonly closureFacade = inject(DetailsFacade);
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
    public reportTreatmentVisible = false;

    // État pour gérer le mode édition/création
    private readonly editingItemId = signal<string | null>(null);
    public readonly isEditMode = computed(() => this.editingItemId() !== null);
    public readonly modalTitle = computed(() =>
        this.isEditMode()
            ? 'PROCESSING.TASKS.ACTIONS.DIALOG.TITLE_EDIT'
            : 'PROCESSING.TASKS.ACTIONS.DIALOG.TITLE_CREATE'
    );

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

    public readonly reportType: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => params['reportType'])
        ),
        { initialValue: '' }
    );

    public readonly operators: Signal<string[]> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => params['operators'])
        ),
        { initialValue: [] }
    );

    public readonly createdAt: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => params['createdAt'])
        ),
        { initialValue: '' }
    );

    public readonly source: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => params['source'])
        ),
        { initialValue: '' }
    );

    public readonly initiatorPhone: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => params['initiatorPhone'])
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
        this.closeModal();
    });

    private readonly modalEffect = effect(() => {
        if (!this.openRequested()) {
            return;
        }
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
        date: new FormControl<Date | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        type: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        description: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        shouldNotifyUser: new FormControl<boolean>(false, {
            nonNullable: true,
        }),
    });

    public readonly hasAction = computed<boolean>(
        () => this.items().length > 0
    );

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
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    public getFormatDate(value: string): string {
        return formatDate(value);
    }

    public getOperatorTagStyle(operator: string): Record<string, string> {
        return operatorsTagStyle(operator);
    }

    public onPageChange(event: number): void {
        if (this.uniqId()) {
            this.facade.changePage(JSON.stringify(event + 1));
        }
    }

    public onRefreshClicked(): void {
        this.facade.refresh();
    }

    public onSeeClicked(): void {
        if (!this.uniqId()) {
            return;
        }
        this.reportTreatmentVisible = true;
    }

    public onClosureClicked(): void {
        if (!this.uniqId()) {
            return;
        }

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.TITLE_CLOSURE'
            ),
            html: this.t(
                'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.MESSAGE_CLOSURE'
            ).replaceAll('uniqId', this.uniqId()),
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.closureFacade.treat({ uniqId: this.uniqId() });
                this.facade.refreshWithLastFilterAndPage();
            }
        });
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
            `${this.exportFilePrefix}-actions-treatment`
        );
    }

    public onHeaderButtonClicked(actionId: string): void {
        if (actionId === 'create') {
            this.prepareCreate();
        }
    }

    public onActionClicked({
        item,
        actionId,
    }: {
        item: TasksActionsEntity;
        actionId?: string;
    }): void {
        switch (actionId) {
            case 'edit':
                this.prepareEdit(item);
                break;
            case 'delete':
                this.confirmDelete(item);
                break;
        }
    }

    private prepareCreate(): void {
        this.editingItemId.set(null);
        this.form.reset({
            shouldNotifyUser: false,
        });
        this.openModal();
    }

    private prepareEdit(item: TasksActionsEntity): void {
        this.editingItemId.set(item.uniqId);
        this.form.patchValue({
            date: item.date,
            type: item.type,
            description: item.description,
            shouldNotifyUser: item.shouldNotifyUser,
        });
        this.openModal();
    }

    private confirmDelete(item: TasksActionsEntity): void {
        if (!this.uniqId() || !item.uniqId) {
            return;
        }

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.TITLE_DELETE'
            ),
            text: this.t(
                'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.MESSAGE_DELETE'
            ),
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.delete({
                    uniqId: item.uniqId,
                });
            }
        });
    }

    private openModal(): void {
        this.openRequested.set(true);
    }

    public closeModal(): void {
        this.displayModal.set(false);
        this.editingItemId.set(null);
        this.form.reset();
    }

    public onSubmit(): void {
        if (this.form.invalid || !this.uniqId()) {
            return;
        }

        const formValue = this.form.getRawValue();
        const basePayload = {
            reportUniqId: this.uniqId(),
            ...formValue,
        };

        const dialogConfig = {
            title: this.isEditMode()
                ? 'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.TITLE_EDIT'
                : 'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.TITLE_CREATE',
            message: this.isEditMode()
                ? 'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.MESSAGE_EDIT'
                : 'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.MESSAGE_CREATE',
        };

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(dialogConfig.title),
            text: this.t(dialogConfig.message),
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((res) => {
            if (res.isConfirmed) {
                if (this.isEditMode()) {
                    // this.facade.update({
                    //     ...basePayload,
                    //     uniqId: this.editingItemId()!,
                    // });
                } else {
                    this.facade.create(basePayload);
                }
            }
        });
    }

    public onReportTreatmentTasks(): void {
        this.facade.refreshWithLastFilterAndPage();
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
