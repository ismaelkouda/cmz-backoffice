import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { ParticipantsCreateEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-create.entity';
import { ParticipantsFilterEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-filter.entity';
import { ParticipantsUpdateEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-update.entity';
import { ParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class ParticipantsRepository {
    abstract readAll(
        filter: ParticipantsFilterEntity | null,
        page: string
    ): Observable<Paginate<ParticipantsEntity>>;
    abstract create(
        payload: ParticipantsCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        payload: ParticipantsUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(uniqId: string): Observable<SimpleResponseDto<void>>;
    abstract enable(uniqId: string): Observable<SimpleResponseDto<void>>;
    abstract disable(uniqId: string): Observable<SimpleResponseDto<void>>;
}
