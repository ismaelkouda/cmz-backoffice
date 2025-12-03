/* import { CommonModule } from '@angular/common';
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
import { ProfileHabilitationFilterInterface } from '@pages/settings-security/data-access/profile-habilitation/interfaces/profile-habilitation-filter.interface';
import { ProfileHabilitationFacade } from '@presentation/pages/settings-security/application/profile-habilitation.facade';
import { ProfileHabilitation } from '@presentation/pages/settings-security/domain/entities/profile-habilitation.entity';
import { ProfileHabilitationFilter } from '@presentation/pages/settings-security/domain/value-objects/profile-habilitation-filter.vo';
import { FilterProfileHabilitationComponent } from '@presentation/pages/settings-security/feature/profile-habilitation/filter-profile-habilitation/filter-profile-habilitation.component';
import { TableProfileHabilitationComponent } from '@presentation/pages/settings-security/feature/profile-habilitation/table-profile-habilitation/table-profile-habilitation.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PROFILE_FORM_ROUTE } from '../../settings-security.routes';

@Component({
    selector: 'app-profile-habilitation',
    standalone: true,
    templateUrl: './profile-habilitation.component.html',
    styleUrls: ['./profile-habilitation.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterProfileHabilitationComponent,
        TableProfileHabilitationComponent,
        PaginationComponent,
        PageTitleComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHabilitationComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<ProfileHabilitation>>;
    public profileHabilitation$!: Observable<ProfileHabilitation[]>;
    public spinner$!: Observable<boolean>;
    public filterData: ProfileHabilitationFilterInterface =
        ProfileHabilitationFilter.create().toDto() as ProfileHabilitationFilterInterface;
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly profileHabilitationFacade: ProfileHabilitationFacade
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ??
                        'SETTINGS_SECURITY.PROFILE_HABILITATION.TITLE'
                );
                this.module = data['module'] ?? 'SETTINGS_SECURITY.LABEL';
                this.subModule =
                    data['subModule'] ??
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.LABEL';
            });

        this.profileHabilitation$ =
            this.profileHabilitationFacade.profileHabilitation$;
        this.pagination$ = this.profileHabilitationFacade.pagination$;
        this.spinner$ = this.profileHabilitationFacade.isLoading$;

        this.profileHabilitationFacade.currentFilter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((filter) => {
                if (filter) {
                    this.filterData =
                        filter.toDto() as ProfileHabilitationFilterInterface;
                    this.profileHabilitationFacade.fetchProfileHabilitation(
                        ProfileHabilitationFilter.create(this.filterData)
                    );
                }
            });

        //const defaultFilter = ProfileHabilitationFilter.create();
        //this.profileHabilitationFacade.fetchProfileHabilitation(defaultFilter);
    }

    public filter(filterData: ProfileHabilitationFilterInterface): void {
        this.filterData = { ...filterData };
        const filter = ProfileHabilitationFilter.create(filterData);
        this.profileHabilitationFacade.fetchProfileHabilitation(filter);
    }

    public refreshProfileHabilitation(): void {
        this.profileHabilitationFacade.refresh();
    }

    public onPageChange(event: number): void {
        this.profileHabilitationFacade.changePage(event + 1);
    }

    public handleAddProfile(): void {
        this.router.navigate([PROFILE_FORM_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public handleProfileHabilitation(event: {
        profile: ProfileHabilitation;
        action: 'view' | 'edit' | 'delete' | 'enable' | 'disable' | 'users';
    }): void {
        const { profile, action } = event;

        switch (action) {
            case 'view':
                this.router.navigate([PROFILE_FORM_ROUTE, profile.id], {
                    relativeTo: this.activatedRoute,
                    queryParams: { view: 'true' },
                });
                break;
            case 'edit':
                this.router.navigate([PROFILE_FORM_ROUTE, profile.id], {
                    relativeTo: this.activatedRoute,
                });
                break;
            case 'delete':
                this.handleDeleteProfile(profile);
                break;
            case 'enable':
                this.handleEnableProfile(profile);
                break;
            case 'disable':
                this.handleDisableProfile(profile);
                break;
            case 'users':
                this.router.navigate([profile.id, 'users'], {
                    relativeTo: this.activatedRoute,
                });
                break;
        }
    }

    private async handleDeleteProfile(
        profile: ProfileHabilitation
    ): Promise<void> {
        const result = await Swal.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.CONFIRM.DELETE_TITLE'
            ),
            text: this.translate.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.CONFIRM.DELETE_MESSAGE',
                { name: profile.name }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('DELETE'),
            cancelButtonText: this.translate.instant('CANCEL'),
        });

        if (result.isConfirmed) {
            this.profileHabilitationFacade
                .deleteProfileHabilitation(profile.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    error: () => {
                        // Error handled in facade
                    },
                });
        }
    }

    private async handleEnableProfile(
        profile: ProfileHabilitation
    ): Promise<void> {
        this.profileHabilitationFacade
            .enableProfileHabilitation(profile.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                error: () => {
                    // Error handled in facade
                },
            });
    }

    private async handleDisableProfile(
        profile: ProfileHabilitation
    ): Promise<void> {
        const result = await Swal.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.CONFIRM.DISABLE_TITLE'
            ),
            text: this.translate.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.CONFIRM.DISABLE_MESSAGE',
                { name: profile.name }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.ACTIONS.DISABLE'
            ),
            cancelButtonText: this.translate.instant('CANCEL'),
        });

        if (result.isConfirmed) {
            this.profileHabilitationFacade
                .disableProfileHabilitation(profile.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    error: () => {
                        // Error handled in facade
                    },
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
 */