import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { ParticipantsQuery } from '@presentation/pages/team-organization/application/queries/participants/participants.query';
import { ParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/participants/participants.use-case';
import { ParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants.entity';

@Injectable({ providedIn: 'root' })
export class ParticipantsHandler {
    constructor(private readonly useCase: ParticipantsUseCase) {}

    execute(
        command: ParticipantsQuery,
        page: string
    ): Observable<Paginate<ParticipantsEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                role: command.role,
                isActive: command.isActive,
            },
            page
        );
    }
}
