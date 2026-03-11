import { inject, Injectable } from '@angular/core';
import { TeamsSelectEntity } from '@pages/team-organization/domain/entities/teams/teams-select.entity';
import { TeamsSelectRepository } from '@pages/team-organization/domain/repositories/teams/teams-select-repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TeamsSelectUseCase {
    private readonly repository = inject(TeamsSelectRepository);

    readAll(): Observable<TeamsSelectEntity[]> {
        return this.repository.readAll();
    }
}
