import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { ParticipantsQuery } from '@presentation/pages/team-organization/application/queries/participants/participants.query';
import { ParticipantsHandler } from '@presentation/pages/team-organization/application/queries-handlers/participants/participants.handler';
import { ParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants.entity';

@Injectable({ providedIn: 'root' })
export class ParticipantsBus {
    constructor(private readonly filterHandler: ParticipantsHandler) {}

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
