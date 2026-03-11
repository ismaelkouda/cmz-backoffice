import { Injectable } from '@angular/core';
import { TeamsFindOneQuery } from '@pages/team-organization/application/queries/teams/teams-find-one.query';
import { TeamsFindOneHandler } from '@pages/team-organization/application/queries-handlers/teams/teams-find-one.handler';
import { TeamsFindOneEntity } from '@pages/team-organization/domain/entities/teams/teams-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsFindOneBus {
    constructor(private readonly filterHandler: TeamsFindOneHandler) {}

    dispatch<T>(command: T): Observable<TeamsFindOneEntity> {
        if (command instanceof TeamsFindOneQuery) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
