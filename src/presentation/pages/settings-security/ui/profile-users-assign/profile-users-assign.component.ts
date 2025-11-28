import { AsyncPipe, CommonModule } from '@angular/common';
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
import { User } from '@presentation/pages/settings-security/domain/entities/user.entity';
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
import Swal from 'sweetalert2';
import { PAGINATION_CONST } from '../../domain/constants/pagination.constants';

interface ProfileUsersFilterInterface {
    matricule?: string;
}

@Component({
    selector: 'app-profile-users-assign',
    standalone: true,
    templateUrl: './profile-users-assign.component.html',
    styleUrls: ['./profile-users-assign.component.scss'],
    imports: [
        CommonModule,
        AsyncPipe,
        BreadcrumbComponent,
        FilterProfileUsersComponent,
        TableProfileUsersComponent,
        PaginationComponent,
        PageTitleComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileUsersAssignComponent implements OnInit, OnDestroy {
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
    public users$!: Observable<User[]>;
    public pagination$!: Observable<Paginate<User>>;
    public spinner$!: Observable<boolean>;
    public selectedUsers: User[] = [];
    public profileId: string = '';
    private readonly destroy$ = new Subject<void>();
    private readonly profileSubject =
        new BehaviorSubject<ProfileHabilitation | null>(null);
    private readonly usersSubject = new BehaviorSubject<User[]>([]);
    private readonly paginationSubject = new BehaviorSubject<Paginate<User>>(
        {} as Paginate<User>
    );

    ngOnInit(): void {
        this.profile$ = this.profileSubject.asObservable();
        this.users$ = this.usersSubject.asObservable();
        this.pagination$ = this.paginationSubject.asObservable();
        this.spinner$ = this.profileHabilitationFacade.isLoading$;
        this.setupRouteData();
        this.loadProfile();
        this.loadUsers();
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ??
                        'SETTINGS_SECURITY.PROFILE_HABILITATION.ASSIGN.TITLE'
                );
                this.module = data['module'] ?? 'SETTINGS_SECURITY.LABEL';
                this.subModule =
                    data['subModule'] ??
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.LABEL';
            });
    }

    private loadProfile(): void {
        const parentParams$ = this.activatedRoute.parent?.params;
        if (parentParams$) {
            parentParams$
                .pipe(
                    map((params) => params['id']),
                    switchMap((id) => {
                        this.profileId = id;
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
        } else {
            this.profileSubject.next(null);
        }
    }

    private loadUsers(filter?: ProfileUsersFilterInterface): void {
        const page = PAGINATION_CONST.DEFAULT_PAGE;
        const filterData = filter?.matricule
            ? { matricule: filter.matricule }
            : undefined;

        this.profileHabilitationFacade
            .getUsersWithoutProfile(page, filterData)
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

    public onSelectionChange(users: User[]): void {
        this.selectedUsers = [...users];
    }

    public onAssign(): void {
        if (this.selectedUsers.length === 0) {
            Swal.fire({
                ...SWEET_ALERT_PARAMS,
                title: this.translate.instant(
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.MESSAGES.NO_SELECTION'
                ),
                icon: 'warning',
                confirmButtonText: this.translate.instant('OK'),
            });
            return;
        }

        Swal.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.CONFIRM.ASSIGN_TITLE'
            ),
            text: this.translate.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.CONFIRM.ASSIGN_MESSAGE',
                { count: this.selectedUsers.length }
            ),
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: this.translate.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.BUTTONS.ASSIGN'
            ),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (result.isConfirmed && this.profileId) {
                const userIds = this.selectedUsers.map((u) => u.id);
                this.profileHabilitationFacade
                    .assignUsers({
                        profileId: this.profileId,
                        userIds,
                    })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.selectedUsers = [];
                            this.router.navigate(['..'], {
                                relativeTo: this.activatedRoute,
                            });
                        },
                        error: () => {
                            // Error handled in facade
                        },
                    });
            }
        });
    }

    public onCancel(): void {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }

    public refreshUsers(): void {
        this.loadUsers();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
