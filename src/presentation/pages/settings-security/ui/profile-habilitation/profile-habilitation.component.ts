/* import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProfileHabilitationFacade } from '@presentation/pages/settings-security/application/profile-habilitation.facade';
import { ProfileHabilitation } from '@presentation/pages/settings-security/domain/entities/profile-habilitation.entity';
import { ProfileHabilitationFilter } from '@presentation/pages/settings-security/domain/value-objects/profile-habilitation-filter.vo';
import { TableProfileHabilitationComponent } from '@presentation/pages/settings-security/feature/profile-habilitation/table-profile-habilitation/table-profile-habilitation.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableConfig, TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PROFILE_HABILITATION_TABLE } from '../../domain/constants/profile-habilitation/profile-habilitation-table.constant';
import { ProfileHabilitationFilterPayloadEntity } from '../../domain/entities/profile-habilitation/profile-habilitation-filter-payload.entity';
import { PROFILE_FORM_ROUTE } from '../../settings-security.routes';

@Component({
    selector: 'app-profile-habilitation',
    standalone: true,
    templateUrl: './profile-habilitation.component.html',
    styleUrls: ['./profile-habilitation.component.scss'],
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        PaginationComponent,
        FilterProfileHabilitationComponent,
        TableProfileHabilitationComponent,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHabilitationComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translateService = inject(TranslateService);
    private readonly profileHabilitationFacade = inject(ProfileHabilitationFacade);
    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly tableExportExcelFileService = inject(TableExportExcelFileService);
    readonly routeParams = toSignal(this.activatedRoute.queryParams, {
        initialValue: {}
    });
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );
    public module!: string;
    public subModule!: string;
    public readonly tableConfig: TableConfig = PROFILE_HABILITATION_TABLE;
    public readonly profileHabilitation$ = this.profileHabilitationFacade.profileHabilitation$;
    public readonly pagination$ = this.profileHabilitationFacade.pagination$;
    public readonly loading$ = this.profileHabilitationFacade.isLoading$;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.setupRouteData();
        this.loadData();
        console.log("routeParams", this.routeParams())
    }

    private loadData(): void {
        const defaultFilter = ProfileHabilitationFilter.create();
        this.profileHabilitationFacade.fetchProfileHabilitation(defaultFilter, '1', false);
    }

    private setupRouteData(): void {
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
    }

    public onFilter(payload: ProfileHabilitationFilterPayloadEntity): void {
        const filter = ProfileHabilitationFilter.create(payload);
        this.profileHabilitationFacade.fetchProfileHabilitation(filter, '1', true);
    }

    public onPageChange(page: number): void {
        this.profileHabilitationFacade.changePage(page);
    }

    public onRefresh(): void {
        this.profileHabilitationFacade.refresh();
    }

    public onExportExcel(profileHabilitation: ProfileHabilitation[]): void {
        this.tableExportExcelFileService.exportAsExcelFile(
            profileHabilitation,
            this.tableConfig,
            `${this.exportFilePrefix}-profile-habilitation`
        );
    }

    private normalizeExportPrefix(appName: string): string {
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }

    public onProfileHabilitationRequested(event: {
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
            title: this.translateService.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.CONFIRM.DELETE_TITLE'
            ),
            text: this.translateService.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.CONFIRM.DELETE_MESSAGE',
                { name: profile.name }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translateService.instant('DELETE'),
            cancelButtonText: this.translateService.instant('CANCEL'),
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
            title: this.translateService.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.CONFIRM.DISABLE_TITLE'
            ),
            text: this.translateService.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.CONFIRM.DISABLE_MESSAGE',
                { name: profile.name }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translateService.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.ACTIONS.DISABLE'
            ),
            cancelButtonText: this.translateService.instant('CANCEL'),
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