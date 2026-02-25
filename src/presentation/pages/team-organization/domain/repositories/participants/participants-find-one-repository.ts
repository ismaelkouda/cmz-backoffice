import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParticipantsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-find-one-filter.entity';
import { ParticipantsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class ParticipantsFindOneRepository {
    abstract execute(
        filter: ParticipantsFindOneFilterEntity
    ): Observable<ParticipantsFindOneEntity>;
}
