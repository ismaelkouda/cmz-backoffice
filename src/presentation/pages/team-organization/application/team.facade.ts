import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@presentation/pages/team-organization/application/base/base-facade';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, tap } from 'rxjs';
import {
    AssignRequestDto,
    ParticipantLibreDto,
    ReassignRequestDto,
    RemoveRequestDto,
    TeamStoreRequestDto,
    TeamUpdateRequestDto,
    TenantLibreDto,
} from '../data/dtos/team-response.dto';
import { Participant } from '../domain/entities/participant.entity';
import { Team } from '../domain/entities/team.entity';
import { Tenant } from '../domain/entities/tenant.entity';
import {
    AssignParticipantsUseCase,
    AssignTenantsUseCase,
    DeleteTeamUseCase,
    DisableTeamUseCase,
    EnableTeamUseCase,
    FetchTeamsUseCase,
    GetFreeParticipantsUseCase,
    GetFreeTenantsUseCase,
    GetParticipantsByTeamUseCase,
    GetTeamsWithoutParticipantUseCase,
    GetTeamsWithoutTenantUseCase,
    GetTenantsByTeamUseCase,
    ReassignParticipantsUseCase,
    ReassignTenantsUseCase,
    RemoveParticipantsUseCase,
    RemoveTenantsUseCase,
    StoreTeamUseCase,
    UpdateTeamUseCase,
} from '../domain/use-cases/team.use-case';
import { TeamFilter } from '../domain/value-objects/team-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class TeamFacade extends BaseFacade<Team, TeamFilter> {
    readonly teams$ = this.items$;
    constructor(
        private readonly fetchTeamsUseCase: FetchTeamsUseCase,
        private readonly storeTeamUseCase: StoreTeamUseCase,
        private readonly updateTeamUseCase: UpdateTeamUseCase,
        private readonly deleteTeamUseCase: DeleteTeamUseCase,
        private readonly enableTeamUseCase: EnableTeamUseCase,
        private readonly disableTeamUseCase: DisableTeamUseCase,
        private readonly getFreeTenantsUseCase: GetFreeTenantsUseCase,
        private readonly getFreeParticipantsUseCase: GetFreeParticipantsUseCase,
        private readonly assignTenantsUseCase: AssignTenantsUseCase,
        private readonly assignParticipantsUseCase: AssignParticipantsUseCase,
        private readonly reassignTenantsUseCase: ReassignTenantsUseCase,
        private readonly reassignParticipantsUseCase: ReassignParticipantsUseCase,
        private readonly removeTenantsUseCase: RemoveTenantsUseCase,
        private readonly removeParticipantsUseCase: RemoveParticipantsUseCase,
        private readonly getTenantsByTeamUseCase: GetTenantsByTeamUseCase,
        private readonly getParticipantsByTeamUseCase: GetParticipantsByTeamUseCase,
        private readonly getTeamsWithoutTenantUseCase: GetTeamsWithoutTenantUseCase,
        private readonly getTeamsWithoutParticipantUseCase: GetTeamsWithoutParticipantUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchTeams(filter: TeamFilter = TeamFilter.create()): void {
        const fetch$ = this.fetchTeamsUseCase.execute(filter);
        this.fetchData(filter, fetch$);
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchTeamsUseCase.execute(currentFilter);
        this.fetchData(currentFilter, fetch$);
    }

    storeTeam(payload: TeamStoreRequestDto): Observable<Team> {
        return this.storeTeamUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.TEAM.MESSAGES.STORE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map((team) => team)
        );
    }

    updateTeam(payload: TeamUpdateRequestDto): Observable<Team> {
        return this.updateTeamUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.TEAM.MESSAGES.UPDATE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map((team) => team)
        );
    }

    deleteTeam(id: string): Observable<void> {
        return this.deleteTeamUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.TEAM.MESSAGES.DELETE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    enableTeam(id: string): Observable<void> {
        return this.enableTeamUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.TEAM.MESSAGES.ENABLE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    disableTeam(id: string): Observable<void> {
        return this.disableTeamUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.TEAM.MESSAGES.DISABLE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    getFreeTenants(): Observable<TenantLibreDto[]> {
        return this.getFreeTenantsUseCase.execute();
    }

    getFreeParticipants(role: string): Observable<ParticipantLibreDto[]> {
        return this.getFreeParticipantsUseCase.execute(role);
    }

    assignTenants(payload: AssignRequestDto): Observable<void> {
        return this.assignTenantsUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.TEAM.MESSAGES.AFFECT_SUCCESS'
                );
                this.toastService.success(successMessage);
            })
        );
    }

    assignParticipants(payload: AssignRequestDto): Observable<void> {
        return this.assignParticipantsUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.TEAM.MESSAGES.AFFECT_SUCCESS'
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
                    'TEAM_ORGANIZATION.TEAM.MESSAGES.REASSIGN_SUCCESS'
                );
                this.toastService.success(successMessage);
            })
        );
    }

    reassignParticipants(payload: ReassignRequestDto): Observable<void> {
        return this.reassignParticipantsUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.TEAM.MESSAGES.REASSIGN_SUCCESS'
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
                    'TEAM_ORGANIZATION.TEAM.MESSAGES.RETIRE_SUCCESS'
                );
                this.toastService.success(successMessage);
            })
        );
    }

    removeParticipants(payload: RemoveRequestDto): Observable<void> {
        return this.removeParticipantsUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.TEAM.MESSAGES.RETIRE_SUCCESS'
                );
                this.toastService.success(successMessage);
            })
        );
    }

    getTenantsByTeam(equipe_id: string): Observable<Tenant[]> {
        return this.getTenantsByTeamUseCase.execute(equipe_id);
    }

    getParticipantsByTeam(equipe_id: string): Observable<Participant[]> {
        return this.getParticipantsByTeamUseCase.execute(equipe_id);
    }

    getTeamsWithoutTenant(equipe_id: string): Observable<Team[]> {
        return this.getTeamsWithoutTenantUseCase.execute(equipe_id);
    }

    getTeamsWithoutParticipant(equipe_id: string): Observable<Team[]> {
        return this.getTeamsWithoutParticipantUseCase.execute(equipe_id);
    }
}
