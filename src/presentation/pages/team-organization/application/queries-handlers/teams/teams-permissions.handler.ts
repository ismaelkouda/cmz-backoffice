import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsPermissionsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-permissions.use-case';
import { TeamsPermissionsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-permissions.entity';

@Injectable({ providedIn: 'root' })
export class TeamsPermissionsHandler {
    constructor(private readonly useCase: TeamsPermissionsUseCase) {}

    execute(): Observable<TeamsPermissionsEntity> {
        return this.useCase.execute();
    }
}
