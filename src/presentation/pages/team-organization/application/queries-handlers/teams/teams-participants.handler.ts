import { teamsParticipantsQueryMapper } from '@pages/team-organization/application/queries-mappers/teams/teams-participants.mapper';
import { Injectable, inject } from '@angular/core';
import { TeamsParticipantsQuery } from '@pages/team-organization/application/queries/teams/teams-participants.query';
import { TeamsParticipantsUseCase } from '@pages/team-organization/application/use-cases/teams/teams-participants.use-case';
import { TeamsParticipantsEntity } from '@pages/team-organization/domain/entities/teams/teams-participants.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsHandler {
    private readonly useCase = inject(TeamsParticipantsUseCase);

    execute(
        command: TeamsParticipantsQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TeamsParticipantsEntity>> {
        return this.useCase.execute(
            teamsParticipantsQueryMapper(command),
            page,
            options
        );
    }
}
