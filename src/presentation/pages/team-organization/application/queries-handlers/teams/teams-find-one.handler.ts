import { Injectable } from '@angular/core';
import { TeamsFindOneQuery } from '@pages/team-organization/application/queries/teams/teams-find-one.query';
import { TeamsFindOneUseCase } from '@pages/team-organization/application/use-cases/teams/teams-find-one.use-case';
import { TeamsFindOneEntity } from '@pages/team-organization/domain/entities/teams/teams-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsFindOneHandler {
    constructor(private readonly useCase: TeamsFindOneUseCase) {}

    execute(command: TeamsFindOneQuery): Observable<TeamsFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
