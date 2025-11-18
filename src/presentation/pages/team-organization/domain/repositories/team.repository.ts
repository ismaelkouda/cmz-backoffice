import {
    AssignRequestDto,
    ParticipantAffectedResponseDto,
    ParticipantLibreDto,
    ReassignRequestDto,
    RemoveRequestDto,
    TeamDeleteResponseDto,
    TeamDisableResponseDto,
    TeamEnableResponseDto,
    TeamStoreRequestDto,
    TeamUpdateRequestDto,
    TenantLibreDto,
    TenantResponseDto,
} from '@presentation/pages/team-organization/data/dtos/team-response.dto';
import { Observable } from 'rxjs';
import { Participant } from '../entities/participant.entity';
import { Tenant } from '../entities/tenant.entity';
import { Team } from '../entities/team.entity';
import { TeamFilter } from '../value-objects/team-filter.vo';

export abstract class TeamRepository {
    abstract fetchTeams(
        filter: TeamFilter
    ): Observable<Team[]>;

    abstract storeTeam(
        payload: TeamStoreRequestDto
    ): Observable<Team>;

    abstract updateTeam(
        payload: TeamUpdateRequestDto
    ): Observable<Team>;

    abstract deleteTeam(id: string): Observable<TeamDeleteResponseDto>;

    abstract enableTeam(id: string): Observable<TeamEnableResponseDto>;

    abstract disableTeam(id: string): Observable<TeamDisableResponseDto>;

    abstract getFreeTenants(): Observable<TenantLibreDto[]>;

    abstract getFreeParticipants(role: string): Observable<ParticipantLibreDto[]>;

    abstract assignTenants(payload: AssignRequestDto): Observable<void>;

    abstract assignParticipants(payload: AssignRequestDto): Observable<void>;

    abstract reassignTenants(payload: ReassignRequestDto): Observable<void>;

    abstract reassignParticipants(payload: ReassignRequestDto): Observable<void>;

    abstract removeTenants(payload: RemoveRequestDto): Observable<void>;

    abstract removeParticipants(payload: RemoveRequestDto): Observable<void>;

    abstract getTenantsByTeam(equipe_id: string): Observable<Tenant[]>;

    abstract getParticipantsByTeam(equipe_id: string): Observable<Participant[]>;

    abstract getTeamsWithoutTenant(equipe_id: string): Observable<Team[]>;

    abstract getTeamsWithoutParticipant(equipe_id: string): Observable<Team[]>;
}

