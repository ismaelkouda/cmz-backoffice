import { Injectable, inject } from '@angular/core';
import { ParticipantsQuery } from '@pages/team-organization/application/queries/participants/participants.query';
import { ParticipantsUseCase } from '@pages/team-organization/application/use-cases/participants/participants.use-case';
import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsHandler {
    private readonly useCase = inject(ParticipantsUseCase);

    execute(
        command: ParticipantsQuery,
        page: string
    ): Observable<Paginate<ParticipantsEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                role: command.role,
                status: command.status,
            },
            page
        );
    }
}
