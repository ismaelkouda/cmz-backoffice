import { teamsFindOneQueryMapper } from '@pages/team-organization/application/queries-mappers/teams/teams-find-one.mapper';
import { Injectable, inject } from '@angular/core';
import { TeamsFindOneQuery } from '@pages/team-organization/application/queries/teams/teams-find-one.query';
import { TeamsFindOneUseCase } from '@pages/team-organization/application/use-cases/teams/teams-find-one.use-case';
import { TeamsFindOneEntity } from '@pages/team-organization/domain/entities/teams/teams-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsFindOneHandler {
    private readonly useCase = inject(TeamsFindOneUseCase);

    execute(
        command: TeamsFindOneQuery,
        options?: FetchOptions
    ): Observable<TeamsFindOneEntity> {
        return this.useCase.execute(teamsFindOneQueryMapper(command), options);
    }
}
