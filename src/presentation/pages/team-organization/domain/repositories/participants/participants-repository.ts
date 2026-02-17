import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { ParticipantsCreateEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-create.entity';
import { ParticipantsDeleteEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-delete.entity';
import { ParticipantsDisableEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-disable.entity';
import { ParticipantsEnableEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-enable.entity';
import { ParticipantsFilterEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-filter.entity';
import { ParticipantsUpdateEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-update.entity';
import { ParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class ParticipantsRepository {
    abstract readAll(
        entity: ParticipantsFilterEntity | null,
        page: string
    ): Observable<Paginate<ParticipantsEntity>>;
    abstract create(
        entity: ParticipantsCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: ParticipantsUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: ParticipantsDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract enable(
        entity: ParticipantsEnableEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(
        entity: ParticipantsDisableEntity
    ): Observable<SimpleResponseDto<void>>;
}
