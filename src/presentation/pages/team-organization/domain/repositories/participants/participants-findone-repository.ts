import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParticipantsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-findone-filter.entity';
import { ParticipantsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-findone.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class ParticipantsFindonRepository {
    abstract read(
        filter: ParticipantsFindOneFilterEntity
    ): Observable<ParticipantsFindOneEntity>;
}
