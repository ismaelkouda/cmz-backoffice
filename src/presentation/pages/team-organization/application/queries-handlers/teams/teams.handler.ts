import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TeamsQuery } from '@presentation/pages/team-organization/application/queries/teams/teams.query';
import { TeamsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams.use-case';
import { TeamsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams.entity';

@Injectable({ providedIn: 'root' })
export class TeamsHandler {
    constructor(private readonly useCase: TeamsUseCase) {}

    execute(
        command: TeamsQuery,
        page: string
    ): Observable<Paginate<TeamsEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                member: command.member,
                isActive: command.isActive,
            },
            page
        );
    }
}
