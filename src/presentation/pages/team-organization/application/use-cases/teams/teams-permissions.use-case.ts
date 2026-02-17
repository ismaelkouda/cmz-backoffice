import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsPermissionsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-permissions.entity';
import { TeamsPermissionsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-permissions-repository';

@Injectable({
    providedIn: 'root',
})
export class TeamsPermissionsUseCase {
    private readonly repository = inject(TeamsPermissionsRepository);

    execute(): Observable<TeamsPermissionsEntity> {
        return this.repository.execute();
    }
}
