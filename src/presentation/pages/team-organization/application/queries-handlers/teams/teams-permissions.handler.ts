import { Injectable, inject } from '@angular/core';
import { TeamsPermissionsUseCase } from '@pages/team-organization/application/use-cases/teams/teams-permissions.use-case';
import { TeamsPermissionsEntity } from '@pages/team-organization/domain/entities/teams/teams-permissions.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsPermissionsHandler {
    private readonly useCase = inject(TeamsPermissionsUseCase);

    execute(options?: FetchOptions): Observable<TeamsPermissionsEntity> {
        return this.useCase.execute(options);
    }
}
