import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@presentation/pages/team-organization/application/base/base-facade';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, tap } from 'rxjs';
import {
    AgentStoreRequestDto,
    AgentUpdateRequestDto,
    AssignRequestDto,
    ReassignRequestDto,
    RemoveRequestDto,
    TenantLibreDto,
} from '../data/dtos/agent-response.dto';
import { AgentIa } from '../domain/entities/agent-ia.entity';
import {
    AssignTenantsUseCase,
    DeleteAgentUseCase,
    DisableAgentUseCase,
    EnableAgentUseCase,
    FetchAgentsUseCase,
    GetFreeTenantsUseCase,
    ReassignTenantsUseCase,
    RemoveTenantsUseCase,
    StoreAgentUseCase,
    UpdateAgentUseCase,
} from '../domain/use-cases/agent.use-case';
import { AgentFilter } from '../domain/value-objects/agent-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class AgentFacade extends BaseFacade<AgentIa, AgentFilter> {
    readonly agents$ = this.items$;
    constructor(
        private readonly fetchAgentsUseCase: FetchAgentsUseCase,
        private readonly storeAgentUseCase: StoreAgentUseCase,
        private readonly updateAgentUseCase: UpdateAgentUseCase,
        private readonly deleteAgentUseCase: DeleteAgentUseCase,
        private readonly enableAgentUseCase: EnableAgentUseCase,
        private readonly disableAgentUseCase: DisableAgentUseCase,
        private readonly getFreeTenantsUseCase: GetFreeTenantsUseCase,
        private readonly assignTenantsUseCase: AssignTenantsUseCase,
        private readonly reassignTenantsUseCase: ReassignTenantsUseCase,
        private readonly removeTenantsUseCase: RemoveTenantsUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchAgents(filter: AgentFilter = AgentFilter.create()): void {
        const fetch$ = this.fetchAgentsUseCase.execute(filter);
        this.fetchData(filter, fetch$);
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchAgentsUseCase.execute(currentFilter);
        this.fetchData(currentFilter, fetch$);
    }

    storeAgent(payload: AgentStoreRequestDto): Observable<AgentIa> {
        return this.storeAgentUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.AGENT_IA.MESSAGES.STORE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map((agent) => agent)
        );
    }

    updateAgent(payload: AgentUpdateRequestDto): Observable<AgentIa> {
        return this.updateAgentUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.AGENT_IA.MESSAGES.UPDATE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map((agent) => agent)
        );
    }

    deleteAgent(id: string): Observable<void> {
        return this.deleteAgentUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.AGENT_IA.MESSAGES.DELETE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    enableAgent(id: string): Observable<void> {
        return this.enableAgentUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.AGENT_IA.MESSAGES.ENABLE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    disableAgent(id: string): Observable<void> {
        return this.disableAgentUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.AGENT_IA.MESSAGES.DISABLE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    getFreeTenants(): Observable<TenantLibreDto[]> {
        return this.getFreeTenantsUseCase.execute();
    }

    assignTenants(payload: AssignRequestDto): Observable<void> {
        return this.assignTenantsUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.AGENT_IA.MESSAGES.AFFECT_SUCCESS'
                );
                this.toastService.success(successMessage);
            })
        );
    }

    reassignTenants(payload: ReassignRequestDto): Observable<void> {
        return this.reassignTenantsUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.AGENT_IA.MESSAGES.REASSIGN_SUCCESS'
                );
                this.toastService.success(successMessage);
            })
        );
    }

    removeTenants(payload: RemoveRequestDto): Observable<void> {
        return this.removeTenantsUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.AGENT_IA.MESSAGES.RETIRE_SUCCESS'
                );
                this.toastService.success(successMessage);
            })
        );
    }
}
