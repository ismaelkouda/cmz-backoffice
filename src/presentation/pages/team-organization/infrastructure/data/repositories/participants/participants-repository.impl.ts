import { inject, Injectable } from '@angular/core';
import { ParticipantsCreateEntity } from '@pages/team-organization/domain/entities/participants/participants-create.entity';
import { ParticipantsDeleteEntity } from '@pages/team-organization/domain/entities/participants/participants-delete.entity';
import { ParticipantsDisableEntity } from '@pages/team-organization/domain/entities/participants/participants-disable.entity';
import { ParticipantsEnableEntity } from '@pages/team-organization/domain/entities/participants/participants-enable.entity';
import { ParticipantsFilterEntity } from '@pages/team-organization/domain/entities/participants/participants-filter.entity';
import { ParticipantsUpdateEntity } from '@pages/team-organization/domain/entities/participants/participants-update.entity';
import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { ParticipantsRepository } from '@pages/team-organization/domain/repositories/participants/participants-repository';
import { participantsCreateMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-create.mapper';
import { participantsDeleteMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-delete.mapper';
import { participantsDisableMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-disable.mapper';
import { participantsEnableMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-enable.mapper';
import { participantsFilterMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-filter.mapper';
import { participantsUpdateMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-update.mapper';
import { ParticipantsMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants.mapper';
import { ParticipantsApi } from '@pages/team-organization/infrastructure/data/sources/participants/participants.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

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
