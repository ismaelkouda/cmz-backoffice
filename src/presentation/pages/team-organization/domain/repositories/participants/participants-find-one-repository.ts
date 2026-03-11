import { Injectable } from '@angular/core';
import { ParticipantsFindOneFilterEntity } from '@pages/team-organization/domain/entities/participants/participants-find-one-filter.entity';
import { ParticipantsFindOneEntity } from '@pages/team-organization/domain/entities/participants/participants-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class ParticipantsFindOneRepository {
    abstract execute(
        filter: ParticipantsFindOneFilterEntity
    ): Observable<ParticipantsFindOneEntity>;
}
