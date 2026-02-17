import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParticipantsFindOneQuery } from '@presentation/pages/team-organization/application/queries/participants/participants-find-one.query';
import { ParticipantsFindOneHandler } from '@presentation/pages/team-organization/application/queries-handlers/participants/participants-find-one.handler';
import { ParticipantsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-find-one.entity';

@Injectable({ providedIn: 'root' })
export class ParticipantsFindOneBus {
    constructor(private readonly filterHandler: ParticipantsFindOneHandler) {}

    dispatch<T>(query: T): Observable<ParticipantsFindOneEntity> {
        if (query instanceof ParticipantsFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
