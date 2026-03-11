import { inject, Injectable } from '@angular/core';
import { TeamsPermissionsEntity } from '@pages/team-organization/domain/entities/teams/teams-permissions.entity';
import { TeamsPermissionsRepository } from '@pages/team-organization/domain/repositories/teams/teams-permissions-repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TeamsPermissionsUseCase {
    private readonly repository = inject(TeamsPermissionsRepository);

    execute(): Observable<TeamsPermissionsEntity> {
        return this.repository.execute();
    }
}
