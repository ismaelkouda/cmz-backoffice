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
import { AgentFacade } from '@presentation/pages/team-organization/application/agent.facade';
import { AgentIa } from '@presentation/pages/team-organization/domain/entities/agent-ia.entity';
import {
    AgentFilter,
    AgentFilterInterface,
} from '@presentation/pages/team-organization/domain/value-objects/agent-filter.vo';
import { FilterAgentIaComponent } from '@presentation/pages/team-organization/feature/agent-ia/filter-agent-ia/filter-agent-ia.component';
import { TableAgentIaComponent } from '@presentation/pages/team-organization/feature/agent-ia/table-agent-ia/table-agent-ia.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';
import {
    FORM_ROUTE,
    MANAGEMENT_AFFECTED_ROUTE,
} from '../../team-organization.routes';

@Component({
    selector: 'app-agent-ia',
    standalone: true,
    templateUrl: './agent-ia.component.html',
    styleUrls: ['./agent-ia.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterAgentIaComponent,
        TableAgentIaComponent,
        PageTitleComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentIaComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly translate = inject(TranslateService);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    public module!: string;
    public subModule!: string;
    public agents$!: Observable<AgentIa[]>;
    public agentsCount$!: Observable<number>;
    public spinner$!: Observable<boolean>;
    public filterData: AgentFilterInterface =
        AgentFilter.create().toDto() as AgentFilterInterface;
    private readonly destroy$ = new Subject<void>();

    constructor(private readonly agentFacade: AgentFacade) {}

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'TEAM_ORGANIZATION.AGENT_IA.TITLE'
                );
                this.module = data['module'] ?? 'TEAM_ORGANIZATION.LABEL';
                this.subModule =
                    data['subModule'] ?? 'TEAM_ORGANIZATION.AGENT_IA.LABEL';
            });

        this.agents$ = this.agentFacade.agents$;
        this.spinner$ = this.agentFacade.isLoading$;
        this.agentsCount$ = this.agents$.pipe(
            map((agents) => agents?.length ?? 0)
        );

        this.agentFacade.currentFilter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((lastFilter) => {
                if (lastFilter) {
                    this.filterData =
                        lastFilter.toDto() as AgentFilterInterface;
                    const filter = AgentFilter.create(this.filterData);
                    this.agentFacade.fetchAgents(filter);
                }
            });
    }

    public filter(filterData: AgentFilterInterface): void {
        this.filterData = { ...filterData };
        const filter = AgentFilter.create(this.filterData);
        this.agentFacade.fetchAgents(filter);
    }

    public refreshAgents(): void {
        this.agentFacade.refresh();
    }

    public handleAddAgent(): void {
        this.router.navigate([FORM_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public handleAgent(event: {
        agent?: AgentIa;
        action: 'view' | 'edit' | 'delete' | 'enable' | 'disable' | 'tenants';
    }): void {
        const { agent, action } = event;

        if (!agent) {
            this.navigateToForm(null, 'add');
            return;
        }

        switch (action) {
            case 'view':
                this.navigateToForm(agent.id, action);
                break;
            case 'edit':
                this.navigateToForm(agent.id, action);
                break;
            case 'tenants':
                this.navigateToManagement(agent.id, action);
                break;
            case 'enable':
                this.confirmEnableAgent(agent);
                break;
            case 'disable':
                this.confirmDisableAgent(agent);
                break;
            case 'delete':
                this.confirmDeleteAgent(agent);
                break;
        }
    }

    private navigateToForm(
        id: string | null,
        ref: 'add' | 'edit' | 'view'
    ): void {
        if (ref === 'add') {
            this.router.navigate([FORM_ROUTE], {
                relativeTo: this.activatedRoute,
            });
            return;
        }
        this.router.navigate([FORM_ROUTE, id], {
            relativeTo: this.activatedRoute,
            queryParams: { view: ref === 'view' ? 'true' : undefined },
        });
    }

    private navigateToManagement(id: string, ref: 'tenants'): void {
        this.router.navigate([id, MANAGEMENT_AFFECTED_ROUTE], {
            relativeTo: this.activatedRoute,
            queryParams: {
                ref,
            },
        });
    }

    private confirmEnableAgent(agent: AgentIa): void {
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'TEAM_ORGANIZATION.AGENT_IA.CONFIRM.ENABLE_TITLE'
            ),
            text: this.translate.instant(
                'TEAM_ORGANIZATION.AGENT_IA.CONFIRM.ENABLE_MESSAGE',
                { name: agent.nom }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('ENABLE'),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.agentFacade
                    .enableAgent(agent.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        error: () => {
                            // handled in facade
                        },
                    });
            }
        });
    }

    private confirmDisableAgent(agent: AgentIa): void {
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'TEAM_ORGANIZATION.AGENT_IA.CONFIRM.DISABLE_TITLE'
            ),
            text: this.translate.instant(
                'TEAM_ORGANIZATION.AGENT_IA.CONFIRM.DISABLE_MESSAGE',
                { name: agent.nom }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant(
                'TEAM_ORGANIZATION.AGENT_IA.ACTIONS.DISABLE'
            ),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.agentFacade
                    .disableAgent(agent.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        error: () => {
                            // handled in facade
                        },
                    });
            }
        });
    }

    private confirmDeleteAgent(agent: AgentIa): void {
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'TEAM_ORGANIZATION.AGENT_IA.CONFIRM.DELETE_TITLE'
            ),
            text: this.translate.instant(
                'TEAM_ORGANIZATION.AGENT_IA.CONFIRM.DELETE_MESSAGE',
                { name: agent.nom }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('DELETE'),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.agentFacade
                    .deleteAgent(agent.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        error: () => {
                            // handled in facade
                        },
                    });
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
