import { participantsQueryMapper } from '@pages/team-organization/application/queries-mappers/participants/participants.mapper';
import { Injectable, inject } from '@angular/core';
import { ParticipantsQuery } from '@pages/team-organization/application/queries/participants/participants.query';
import { ParticipantsUseCase } from '@pages/team-organization/application/use-cases/participants/participants.use-case';
import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsHandler {
    private readonly useCase = inject(ParticipantsUseCase);

    execute(
        command: ParticipantsQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ParticipantsEntity>> {
        return this.useCase.execute(
            participantsQueryMapper(command),
            page,
            options
        );
    }
}
