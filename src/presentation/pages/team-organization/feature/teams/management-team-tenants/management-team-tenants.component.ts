import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TeamFacade } from '@presentation/pages/team-organization/application/team.facade';
import { Tenant } from '@presentation/pages/team-organization/domain/entities/tenant.entity';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { FilterTeamTenantsComponent } from '../filter-team-tenants/filter-team-tenants.component';
import { ModalReassignTenantsComponent } from '../modal-reassign-tenants/modal-reassign-tenants.component';
import { TableTeamTenantsComponent } from '../table-team-tenants/table-team-tenants.component';

interface TeamTenantsFilterInterface {
    code?: string;
}

@Component({
    selector: 'app-management-team-tenants',
    standalone: true,
    templateUrl: './management-team-tenants.component.html',
    styleUrls: ['./management-team-tenants.component.scss'],
    imports: [
        CommonModule,
        AsyncPipe,
        FilterTeamTenantsComponent,
        TableTeamTenantsComponent,
        ModalReassignTenantsComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementTeamTenantsComponent implements OnInit, OnDestroy {
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly teamFacade = inject(TeamFacade);

    @Input() teamId: string = '';

    public tenants$!: Observable<Tenant[]>;
    public spinner$!: Observable<boolean>;
    public selectedTenants: Tenant[] = [];
    public visibleReassignModal: boolean = false;
    private readonly destroy$ = new Subject<void>();
    private readonly tenantsSubject = new BehaviorSubject<Tenant[]>([]);

    ngOnInit(): void {
        this.tenants$ = this.tenantsSubject.asObservable();
        this.spinner$ = this.teamFacade.isLoading$;
        this.loadTenants();
    }

    private loadTenants(filter?: TeamTenantsFilterInterface): void {
        if (!this.teamId) {
            return;
        }

        this.teamFacade
            .getTenantsByTeam(this.teamId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (tenants) => {
                    let filteredTenants = tenants;
                    if (filter?.code) {
                        filteredTenants = tenants.filter((t) =>
                            t.code
                                .toLowerCase()
                                .includes(filter.code!.toLowerCase())
                        );
                    }
                    this.tenantsSubject.next(filteredTenants);
                },
                error: () => {
                    this.tenantsSubject.next([]);
                },
            });
    }

    public filter(filterData: TeamTenantsFilterInterface): void {
        this.loadTenants(filterData);
    }

    public onSelectionChange(tenants: Tenant[]): void {
        this.selectedTenants = tenants;
    }

    public onAssign(): void {
        this.router.navigate(['assign-tenants'], {
            relativeTo: this.activatedRoute,
        });
    }

    public onRemove(tenants: Tenant[]): void {
        if (tenants.length === 0 || !this.teamId) {
            return;
        }

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.CONFIRM.RETIRE_TENANTS_TITLE'
            ),
            text: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.CONFIRM.RETIRE_TENANTS_MESSAGE',
                { count: tenants.length }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.BUTTONS.RETIRE'
            ),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (result.isConfirmed && this.teamId) {
                const tenantIds = tenants.map((t) => t.id);
                this.teamFacade
                    .removeTenants({
                        equipe_id: this.teamId,
                        tenant_ids: tenantIds,
                    })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.selectedTenants = [];
                            this.loadTenants();
                        },
                        error: () => {
                            // Error handled in facade
                        },
                    });
            }
        });
    }

    public onReassign(tenants: Tenant[]): void {
        if (tenants.length === 0 || !this.teamId) {
            return;
        }
        this.selectedTenants = [...tenants];
        this.visibleReassignModal = true;
    }

    public onReassignConfirm(event: {
        newTeamId: string;
        tenantIds: string[];
    }): void {
        if (!this.teamId) {
            return;
        }
        this.teamFacade
            .reassignTenants({
                equipe_id: this.teamId,
                new_equipe_id: event.newTeamId,
                tenant_ids: event.tenantIds,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.selectedTenants = [];
                    this.loadTenants();
                },
                error: () => {
                    // Error handled in facade
                },
            });
    }

    public refreshTenants(): void {
        this.loadTenants();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
