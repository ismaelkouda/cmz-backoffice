import { inject, Injectable } from '@angular/core';
import { TeamsSelectEntity } from '@pages/team-organization/domain/entities/teams/teams-select.entity';
import { TeamsSelectRepository } from '@pages/team-organization/domain/repositories/teams/teams-select-repository';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TeamsSelectUseCase {
    private readonly repository = inject(TeamsSelectRepository);

    readAll(options?: FetchOptions): Observable<TeamsSelectEntity[]> {
        return this.repository.readAll(options);
    }
}
