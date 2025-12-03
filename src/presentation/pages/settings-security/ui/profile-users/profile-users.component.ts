/* import { AsyncPipe, CommonModule } from '@angular/common';
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
import { ProfileHabilitationFacade } from '@presentation/pages/settings-security/application/profile-habilitation.facade';
import { ProfileHabilitation } from '@presentation/pages/settings-security/domain/entities/profile-habilitation.entity';
import { FilterProfileUsersComponent } from '@presentation/pages/settings-security/feature/profile-habilitation/filter-profile-users/filter-profile-users.component';
import { TableProfileUsersComponent } from '@presentation/pages/settings-security/feature/profile-habilitation/table-profile-users/table-profile-users.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import {
    BehaviorSubject,
    Observable,
    Subject,
    map,
    switchMap,
    takeUntil,
} from 'rxjs';
import SweetAlert from 'sweetalert2';
import { PAGINATION_CONST } from '../../domain/constants/pagination.constants';
import { UsersEntity } from '../../domain/entities/users/users.entity';
import { ModalReassignComponent } from '../../feature/profile-habilitation/modal-reassign/modal-reassign.component';

interface ProfileUsersFilterInterface {
    matricule?: string;
}

@Component({
    selector: 'app-profile-users',
    standalone: true,
    templateUrl: './profile-users.component.html',
    styleUrls: ['./profile-users.component.scss'],
    imports: [
        CommonModule,
        AsyncPipe,
        BreadcrumbComponent,
        FilterProfileUsersComponent,
        TableProfileUsersComponent,
        ModalReassignComponent,
        PaginationComponent,
        PageTitleComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileUsersComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly profileHabilitationFacade = inject(
        ProfileHabilitationFacade
    );

    public module!: string;
    public subModule!: string;
    public profile$!: Observable<ProfileHabilitation | null>;
    public users$!: Observable<UsersEntity[]>;
    public pagination$!: Observable<Paginate<UsersEntity>>;
    public spinner$!: Observable<boolean>;
    public selectedUsers: UsersEntity[] = [];
    public visibleReassignModal: boolean = false;
    public profileId: string = '';
    private readonly destroy$ = new Subject<void>();
    private readonly usersSubject = new BehaviorSubject<UsersEntity[]>([]);
    private readonly paginationSubject = new BehaviorSubject<Paginate<UsersEntity>>(
        {} as Paginate<UsersEntity>
    );
    private readonly profileSubject =
        new BehaviorSubject<ProfileHabilitation | null>(null);

    ngOnInit(): void {
        this.profile$ = this.profileSubject.asObservable();
        this.users$ = this.usersSubject.asObservable();
        this.pagination$ = this.paginationSubject.asObservable();
        this.spinner$ = this.profileHabilitationFacade.isLoading$;
        this.setupRouteData();
        this.loadProfile();
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ??
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.USERS.TITLE'
                );
                this.module = data['module'] ?? 'SETTINGS_SECURITY.LABEL';
                this.subModule =
                    data['subModule'] ??
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.LABEL';
            });
    }

    private loadProfile(): void {
        this.activatedRoute.params
            .pipe(
                map((params) => params['id']),
                switchMap((id) => {
                    this.profileId = id;
                    // Load users when profile ID is available
                    if (id) {
                        this.loadUsers();
                    }
                    return this.profileHabilitationFacade.profileHabilitation$.pipe(
                        map(
                            (profiles) =>
                                profiles.find((p) => p.id === id) ?? null
                        )
                    );
                }),
                takeUntil(this.destroy$)
            )
            .subscribe((profile) => {
                this.profileSubject.next(profile);
            });
    }

    private loadUsers(filter?: ProfileUsersFilterInterface): void {
        if (!this.profileId) {
            return;
        }

        const page = PAGINATION_CONST.DEFAULT_PAGE;
        const filterData = filter?.matricule
            ? { matricule: filter.matricule }
            : undefined;

        this.profileHabilitationFacade
            .getUsersByProfile(this.profileId, page, filterData)
            .pipe(takeUntil(this.destroy$))
            .subscribe((paginated) => {
                this.usersSubject.next(paginated.data ?? []);
                this.paginationSubject.next(paginated);
            });
    }

    public filter(filterData: ProfileUsersFilterInterface): void {
        this.loadUsers(filterData);
    }

    public onPageChange(event: number): void {
        // TODO: Implement pagination
    }

    public onSelectionChange(users: UsersEntity[]): void {
        this.selectedUsers = users;
    }

    public onAssign(): void {
        this.router.navigate(['assign'], {
            relativeTo: this.activatedRoute,
        });
    }

    public onRemove(users: UsersEntity[]): void {
        if (users.length === 0 || !this.profileId) {
            return;
        }

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.CONFIRM.RETIRE_TITLE'
            ),
            text: this.translate.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.CONFIRM.RETIRE_MESSAGE',
                { count: users.length }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.BUTTONS.RETIRE'
            ),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (result.isConfirmed && this.profileId) {
                const userIds = users.map((u) => u.id);
                this.profileHabilitationFacade
                    .removeUsers({
                        profileId: this.profileId,
                        userIds,
                    })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.selectedUsers = [];
                            this.loadUsers();
                        },
                        error: () => {
                            // Error handled in facade
                        },
                    });
            }
        });
    }

    public onReassign(users: UsersEntity[]): void {
        if (users.length === 0 || !this.profileId) {
            return;
        }
        this.selectedUsers = [...users];
        this.visibleReassignModal = true;
    }

    public onReassignConfirm(event: {
        newProfileId: string;
        userIds: string[];
    }): void {
        if (!this.profileId) {
            return;
        }
        this.profileHabilitationFacade
            .reassignUsers({
                profileId: this.profileId,
                newProfileId: event.newProfileId,
                userIds: event.userIds,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.selectedUsers = [];
                    this.loadUsers();
                },
                error: () => {
                    // Error handled in facade
                },
            });
    }

    public refreshUsers(): void {
        this.loadUsers();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
 */