import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParticipantsSelectEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-select.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class ParticipantsSelectRepository {
    abstract readAll(): Observable<ParticipantsSelectEntity[]>;
}
