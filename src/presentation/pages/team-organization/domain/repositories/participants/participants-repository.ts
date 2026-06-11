import { Injectable } from '@angular/core';
import { ParticipantsCreateEntity } from '@pages/team-organization/domain/entities/participants/participants-create.entity';
import { ParticipantsDeleteEntity } from '@pages/team-organization/domain/entities/participants/participants-delete.entity';
import { ParticipantsDisableEntity } from '@pages/team-organization/domain/entities/participants/participants-disable.entity';
import { ParticipantsEnableEntity } from '@pages/team-organization/domain/entities/participants/participants-enable.entity';
import { ParticipantsFilterEntity } from '@pages/team-organization/domain/entities/participants/participants-filter.entity';
import { ParticipantsUpdateEntity } from '@pages/team-organization/domain/entities/participants/participants-update.entity';
import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class ParticipantsRepository {
    abstract readAll(
        entity: ParticipantsFilterEntity | null,
        page: string,
        options?: FetchOptions
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
