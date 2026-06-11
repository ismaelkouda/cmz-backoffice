import { Injectable } from '@angular/core';
import { ParticipantsSelectEntity } from '@pages/team-organization/domain/entities/participants/participants-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class ParticipantsSelectRepository {
    abstract readAll(
        options?: FetchOptions
    ): Observable<ParticipantsSelectEntity[]>;
}
