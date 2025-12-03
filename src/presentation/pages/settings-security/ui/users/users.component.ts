import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserFacade } from '@presentation/pages/settings-security/application/user.facade';
import { UsersEntity } from '@presentation/pages/settings-security/domain/entities/users/users.entity';
import { UserFilter } from '@presentation/pages/settings-security/domain/value-objects/user-filter.vo';
import { FilterUserComponent } from '@presentation/pages/settings-security/feature/user/filter-user/filter-user.component';
import { TableUserComponent } from '@presentation/pages/settings-security/feature/user/table-user/table-user.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { UsersFilterPayloadEntity } from '../../domain/entities/users/users-filter-payload.entity';
import { USER_FORM_ROUTE } from '../../settings-security.routes';

@Component({
    selector: 'app-users',
    standalone: true,
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterUserComponent,
        TableUserComponent,
        PaginationComponent,
        PageTitleComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly translate = inject(TranslateService);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<UsersEntity>>;
    public users$!: Observable<UsersEntity[]>;
    public loading$!: Observable<boolean>;
    private readonly destroy$ = new Subject<void>();

    constructor(private readonly userFacade: UserFacade) { }

    ngOnInit(): void {
        this.setupRouteData();
        this.setupObservables();
        this.loadData();
    }

    private loadData(): void {
        const defaultFilter = UserFilter.create();
        this.userFacade.fetchUsers(defaultFilter, '1', false);
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'SETTINGS_SECURITY.USER.TITLE'
                );
                this.module = data['module'] ?? 'SETTINGS_SECURITY.LABEL';
                this.subModule =
                    data['subModule'] ?? 'SETTINGS_SECURITY.USER.LABEL';
            });
    }

    private setupObservables(): void {
        this.users$ = this.userFacade.users$;
        this.pagination$ = this.userFacade.pagination$;
        this.loading$ = this.userFacade.isLoading$;
    }

    public filter(filterData: UsersFilterPayloadEntity): void {
        const filter = UserFilter.create(filterData);
        this.userFacade.fetchUsers(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.userFacade.changePage(event + 1);
    }

    public handleUser(event: {
        user: UsersEntity;
        action: 'view' | 'edit' | 'delete' | 'disable';
    }): void {
        const { user, action } = event;

        switch (action) {
            case 'view':
                this.router.navigate([USER_FORM_ROUTE, user.id], {
                    relativeTo: this.activatedRoute,
                    queryParams: { view: 'true' },
                });
                break;
            case 'edit':
                this.router.navigate([USER_FORM_ROUTE, user.id], {
                    relativeTo: this.activatedRoute,
                });
                break;
            case 'delete':
                this.handleDeleteUser(user);
                break;
            case 'disable':
                this.handleDisableUser(user);
                break;
        }
    }

    public handleAddUser(): void {
        this.router.navigate([USER_FORM_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    private async handleDeleteUser(user: UsersEntity): Promise<void> {
        const result = await Swal.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'SETTINGS_SECURITY.USER.CONFIRM.DELETE_TITLE'
            ),
            text: this.translate.instant(
                'SETTINGS_SECURITY.USER.CONFIRM.DELETE_MESSAGE',
                {
                    name: user.fullName,
                }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('DELETE'),
            cancelButtonText: this.translate.instant('CANCEL'),
        });

        if (result.isConfirmed) {
            this.userFacade
                .deleteUser(user.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    error: () => {

                    },
                });
        }
    }

    private async handleDisableUser(user: UsersEntity): Promise<void> {
        const result = await Swal.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'SETTINGS_SECURITY.USER.CONFIRM.DISABLE_TITLE'
            ),
            text: this.translate.instant(
                'SETTINGS_SECURITY.USER.CONFIRM.DISABLE_MESSAGE',
                {
                    name: user.fullName,
                }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant(
                'SETTINGS_SECURITY.USER.ACTIONS.DISABLE'
            ),
            cancelButtonText: this.translate.instant('CANCEL'),
        });

        if (result.isConfirmed) {
            this.userFacade
                .disableUser(user.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    error: () => {
                        // Error handled in facade
                    },
                });
        }
    }

    public handleNewspaper(item: UsersEntity): void {
        // Journal opening will be wired when the design validation is delivered.
    }

    public refreshUsers(): void {
        this.userFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
