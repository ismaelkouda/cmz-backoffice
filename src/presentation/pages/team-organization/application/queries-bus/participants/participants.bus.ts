import { Injectable, inject } from '@angular/core';
import { ParticipantsQuery } from '@pages/team-organization/application/queries/participants/participants.query';
import { ParticipantsHandler } from '@pages/team-organization/application/queries-handlers/participants/participants.handler';
import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsBus {
    private readonly filterHandler = inject(ParticipantsHandler);

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<ParticipantsEntity>> {
        if (query instanceof ParticipantsQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
