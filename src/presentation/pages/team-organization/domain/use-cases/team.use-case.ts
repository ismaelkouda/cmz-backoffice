import { inject, Injectable } from '@angular/core';
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
import { TeamRepository } from '../repositories/team.repository';
import { TeamFilter } from '../value-objects/team-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchTeamsUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(filter: TeamFilter): Observable<Team[]> {
        return this.teamRepository.fetchTeams(filter);
    }
}

@Injectable({
    providedIn: 'root',
})
export class StoreTeamUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(payload: TeamStoreRequestDto): Observable<Team> {
        return this.teamRepository.storeTeam(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class UpdateTeamUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(payload: TeamUpdateRequestDto): Observable<Team> {
        return this.teamRepository.updateTeam(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DeleteTeamUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(id: string): Observable<TeamDeleteResponseDto> {
        return this.teamRepository.deleteTeam(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class EnableTeamUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(id: string): Observable<TeamEnableResponseDto> {
        return this.teamRepository.enableTeam(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DisableTeamUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(id: string): Observable<TeamDisableResponseDto> {
        return this.teamRepository.disableTeam(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class GetFreeTenantsUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(): Observable<TenantLibreDto[]> {
        return this.teamRepository.getFreeTenants();
    }
}

@Injectable({
    providedIn: 'root',
})
export class GetFreeParticipantsUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(role: string): Observable<ParticipantLibreDto[]> {
        return this.teamRepository.getFreeParticipants(role);
    }
}

@Injectable({
    providedIn: 'root',
})
export class AssignTenantsUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(payload: AssignRequestDto): Observable<void> {
        return this.teamRepository.assignTenants(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class AssignParticipantsUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(payload: AssignRequestDto): Observable<void> {
        return this.teamRepository.assignParticipants(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class ReassignTenantsUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(payload: ReassignRequestDto): Observable<void> {
        return this.teamRepository.reassignTenants(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class ReassignParticipantsUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(payload: ReassignRequestDto): Observable<void> {
        return this.teamRepository.reassignParticipants(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class RemoveTenantsUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(payload: RemoveRequestDto): Observable<void> {
        return this.teamRepository.removeTenants(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class RemoveParticipantsUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(payload: RemoveRequestDto): Observable<void> {
        return this.teamRepository.removeParticipants(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class GetTenantsByTeamUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(equipe_id: string): Observable<Tenant[]> {
        return this.teamRepository.getTenantsByTeam(equipe_id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class GetParticipantsByTeamUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(equipe_id: string): Observable<Participant[]> {
        return this.teamRepository.getParticipantsByTeam(equipe_id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class GetTeamsWithoutTenantUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(equipe_id: string): Observable<Team[]> {
        return this.teamRepository.getTeamsWithoutTenant(equipe_id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class GetTeamsWithoutParticipantUseCase {
    private readonly teamRepository = inject(TeamRepository);

    execute(equipe_id: string): Observable<Team[]> {
        return this.teamRepository.getTeamsWithoutParticipant(equipe_id);
    }
}

