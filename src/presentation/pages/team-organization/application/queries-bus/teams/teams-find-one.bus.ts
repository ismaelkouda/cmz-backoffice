import { Injectable, inject } from '@angular/core';
import { TeamsFindOneQuery } from '@pages/team-organization/application/queries/teams/teams-find-one.query';
import { TeamsFindOneHandler } from '@pages/team-organization/application/queries-handlers/teams/teams-find-one.handler';
import { TeamsFindOneEntity } from '@pages/team-organization/domain/entities/teams/teams-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class TeamsFindOneBus {
    private readonly filterHandler = inject(TeamsFindOneHandler);

    dispatch<T>(
        command: T,
        options?: FetchOptions
    ): Observable<TeamsFindOneEntity> {
        if (command instanceof TeamsFindOneQuery) {
            return this.filterHandler.execute(command, options);
        }

        throw new Error('No handler found for command');
    }
}
