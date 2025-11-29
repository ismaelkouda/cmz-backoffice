import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Participant } from '../../domain/entities/participant.entity';
import { Tenant } from '../../domain/entities/tenant.entity';
import { Team } from '../../domain/entities/team.entity';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { TeamFilter } from '../../domain/value-objects/team-filter.vo';
import {
    AssignRequestDto,
    ParticipantAffectedResponseDto,
    ParticipantLibreDto,
    ReassignRequestDto,
    RemoveRequestDto,
    TeamDeleteResponseDto,
    TeamDisableResponseDto,
    TeamEnableResponseDto,
    TeamResponseDto,
    TeamStoreRequestDto,
    TeamUpdateRequestDto,
    TenantLibreDto,
    TenantResponseDto,
} from '../dtos/team-response.dto';
import { ParticipantAffectedMapper } from '../mappers/participant-affected.mapper';
import { TeamMapper } from '../mappers/team.mapper';
import { TenantMapper } from '../mappers/tenant.mapper';
import { TeamApi } from '../sources/team.api';

@Injectable({
    providedIn: 'root',
})
export class TeamRepositoryImpl extends TeamRepository {
    constructor(
        private readonly teamApi: TeamApi,
        private readonly teamMapper: TeamMapper,
        private readonly tenantMapper: TenantMapper,
        private readonly participantAffectedMapper: ParticipantAffectedMapper
    ) {
        super();
    }

    fetchTeams(filter: TeamFilter): Observable<Team[]> {
        return this.teamApi
            .fetchTeams(filter.toDto())
            .pipe(map((response) => this.teamMapper.mapFromDto(response)));
    }

    storeTeam(payload: TeamStoreRequestDto): Observable<Team> {
        return this.teamApi.storeTeam(payload).pipe(
            map((response) => {
                if (
                    response.data &&
                    Array.isArray(response.data) &&
                    response.data.length > 0
                ) {
                    return this.teamMapper.mapItemFromDto(response.data[0]);
                }
                throw new Error('Invalid response from store team');
            })
        );
    }

    updateTeam(payload: TeamUpdateRequestDto): Observable<Team> {
        return this.teamApi.updateTeam(payload).pipe(
            map((response) => {
                if (
                    response.data &&
                    Array.isArray(response.data) &&
                    response.data.length > 0
                ) {
                    return this.teamMapper.mapItemFromDto(response.data[0]);
                }
                throw new Error('Invalid response from update team');
            })
        );
    }

    deleteTeam(id: string): Observable<TeamDeleteResponseDto> {
        return this.teamApi.deleteTeam(id);
    }

    enableTeam(id: string): Observable<TeamEnableResponseDto> {
        return this.teamApi.enableTeam(id);
    }

    disableTeam(id: string): Observable<TeamDisableResponseDto> {
        return this.teamApi.disableTeam(id);
    }

    getFreeTenants(): Observable<TenantLibreDto[]> {
        return this.teamApi
            .getFreeTenants()
            .pipe(map((response) => response.data || []));
    }

    getFreeParticipants(role: string): Observable<ParticipantLibreDto[]> {
        return this.teamApi
            .getFreeParticipants(role)
            .pipe(map((response) => response.data || []));
    }

    assignTenants(payload: AssignRequestDto): Observable<void> {
        return this.teamApi.assignTenants(payload);
    }

    assignParticipants(payload: AssignRequestDto): Observable<void> {
        return this.teamApi.assignParticipants(payload);
    }

    reassignTenants(payload: ReassignRequestDto): Observable<void> {
        return this.teamApi.reassignTenants(payload);
    }

    reassignParticipants(payload: ReassignRequestDto): Observable<void> {
        return this.teamApi.reassignParticipants(payload);
    }

    removeTenants(payload: RemoveRequestDto): Observable<void> {
        return this.teamApi.removeTenants(payload);
    }

    removeParticipants(payload: RemoveRequestDto): Observable<void> {
        return this.teamApi.removeParticipants(payload);
    }

    getTenantsByTeam(equipe_id: string): Observable<Tenant[]> {
        return this.teamApi
            .getTenantsByTeam(equipe_id)
            .pipe(map((response) => this.tenantMapper.mapFromDto(response)));
    }

    getParticipantsByTeam(equipe_id: string): Observable<Participant[]> {
        return this.teamApi
            .getParticipantsByTeam(equipe_id)
            .pipe(
                map((response) =>
                    this.participantAffectedMapper.mapFromDto(response)
                )
            );
    }

    getTeamsWithoutTenant(equipe_id: string): Observable<Team[]> {
        return this.teamApi
            .getTeamsWithoutTenant(equipe_id)
            .pipe(map((response) => this.teamMapper.mapFromDto(response)));
    }

    getTeamsWithoutParticipant(equipe_id: string): Observable<Team[]> {
        return this.teamApi
            .getTeamsWithoutParticipant(equipe_id)
            .pipe(map((response) => this.teamMapper.mapFromDto(response)));
    }
}
