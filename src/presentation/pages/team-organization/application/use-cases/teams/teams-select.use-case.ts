import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsSelectEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-select.entity';
import { TeamsSelectRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-select-repository';

@Injectable({
    providedIn: 'root',
})
export class TeamsSelectUseCase {
    private readonly repository = inject(TeamsSelectRepository);

    readAll(): Observable<TeamsSelectEntity[]> {
        return this.repository.readAll();
    }
}
