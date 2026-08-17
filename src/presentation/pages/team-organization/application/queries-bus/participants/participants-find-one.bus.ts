import { Injectable, inject } from '@angular/core';
import { ParticipantsFindOneQuery } from '@pages/team-organization/application/queries/participants/participants-find-one.query';
import { ParticipantsFindOneHandler } from '@pages/team-organization/application/queries-handlers/participants/participants-find-one.handler';
import { ParticipantsFindOneEntity } from '@pages/team-organization/domain/entities/participants/participants-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class ParticipantsFindOneBus {
    private readonly filterHandler = inject(ParticipantsFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<ParticipantsFindOneEntity> {
        if (query instanceof ParticipantsFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
