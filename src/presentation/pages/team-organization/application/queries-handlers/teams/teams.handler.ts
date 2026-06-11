import { Injectable, inject } from '@angular/core';
import { TeamsQuery } from '@pages/team-organization/application/queries/teams/teams.query';
import { TeamsUseCase } from '@pages/team-organization/application/use-cases/teams/teams.use-case';
import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsHandler {
    private readonly useCase = inject(TeamsUseCase);

    execute(
        command: TeamsQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TeamsEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                member: command.member,
                status: command.status,
            },
            page,
            options
        );
    }
}
