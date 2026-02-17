import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

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
import { ParticipantsRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-repository';
import { participantsCreateMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-create.mapper';
import { participantsDeleteMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-delete.mapper';
import { participantsDisableMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-disable.mapper';
import { participantsEnableMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-enable.mapper';
import { participantsFilterMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-filter.mapper';
import { participantsUpdateMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-update.mapper';
import { ParticipantsMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants.mapper';
import { ParticipantsApi } from '@presentation/pages/team-organization/infrastructure/data/sources/participants/participants.api';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsRepositoryImpl implements ParticipantsRepository {
    private readonly api = inject(ParticipantsApi);
    private readonly mapper = inject(ParticipantsMapper);

    readAll(
        filter: ParticipantsFilterEntity,
        page: string
    ): Observable<Paginate<ParticipantsEntity>> {
        return this.api
            .readAll(participantsFilterMapper(filter), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        payload: ParticipantsCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(participantsCreateMapper(payload));
    }

    update(
        payload: ParticipantsUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(participantsUpdateMapper(payload));
    }

    delete(
        entity: ParticipantsDeleteEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.delete(participantsDeleteMapper(entity));
    }

    enable(
        entity: ParticipantsEnableEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.enable(participantsEnableMapper(entity));
    }

    disable(
        entity: ParticipantsDisableEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.disable(participantsDisableMapper(entity));
    }
}
