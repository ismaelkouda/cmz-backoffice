import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UsersFacade } from '@pages/settings-security/application/services/users/users.facade';
import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { USERS_FORM } from '@pages/settings-security/presentation/users/users.routes';
import { USERS_TABLE } from '@presentation/pages/settings-security/presentation/adapters/users/users-table.constant';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';

import { UsersPresenter } from '../../adapters/users/users-vm.presenter';

@Component({
    selector: 'app-users-list',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    public readonly facade = inject(UsersFacade);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    public readonly tableConfig = USERS_TABLE;
    private readonly destroy$ = new Subject<void>();
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );

    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: {} as Paginate<UsersEntity>,
    });
    readonly presenter = new UsersPresenter(
        this.translate.instant.bind(this.translate)
    );
    readonly itemsVM = computed(() => {
        this.currentLang();
        return this.items().map((item) => this.presenter.map(item));
    });
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.config.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    constructor() {
        this.facade.readAll();
    }

    ngOnInit(): void {
        this.title.setTitle(this.t('SETTINGS_SECURITY.USERS.PAGE_TITLE'));

        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('SETTINGS_SECURITY.USERS.PAGE_TITLE')
                );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onPageChangeClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }

    public onRefreshClicked(): void {
        this.facade.refresh();
    }

    public onCreateClicked({ ref }: { ref: CrudFormType }): void {
        this.router.navigate([USERS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams: {
                ref: ref,
            },
        });
    }

    public onNavigateToForm(event: {
        item?: UsersEntity;
        ref: CrudFormType;
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate([USERS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onDeleteClicked(item: UsersEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('SETTINGS_SECURITY.USERS.SWEET_ALERT.TITLE_DELETE'),
            text: `${this.t('SETTINGS_SECURITY.USERS.SWEET_ALERT.MESSAGE_DELETE')}`,
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.delete({ uniqId: item.uniqId });
                this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    public onEnableClicked(item: UsersEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('SETTINGS_SECURITY.USERS.SWEET_ALERT.TITLE_ENABLE'),
            text: `${this.t('SETTINGS_SECURITY.USERS.SWEET_ALERT.MESSAGE_ENABLE')}`,
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.enable({ uniqId: item.uniqId });
                this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    public onDisableClicked(item: UsersEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('SETTINGS_SECURITY.USERS.SWEET_ALERT.TITLE_DISABLE'),
            text: `${this.t('SETTINGS_SECURITY.USERS.SWEET_ALERT.MESSAGE_DISABLE')}`,
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.disable({ uniqId: item.uniqId });
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
            `${this.exportFilePrefix}-users`
        );
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    private normalizeExportPrefix(appName: string): string {
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }
}
