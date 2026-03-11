import { Injectable } from '@angular/core';
import { ParticipantsSelectEntity } from '@pages/team-organization/domain/entities/participants/participants-select.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class ParticipantsSelectRepository {
    abstract readAll(
        filter: string | null
    ): Observable<ParticipantsSelectEntity[]>;
}
