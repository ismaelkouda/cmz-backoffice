import { inject, Injectable } from '@angular/core';
import { ParticipantsCreateEntity } from '@pages/team-organization/domain/entities/participants/participants-create.entity';
import { ParticipantsDeleteEntity } from '@pages/team-organization/domain/entities/participants/participants-delete.entity';
import { ParticipantsDisableEntity } from '@pages/team-organization/domain/entities/participants/participants-disable.entity';
import { ParticipantsEnableEntity } from '@pages/team-organization/domain/entities/participants/participants-enable.entity';
import { ParticipantsFilterEntity } from '@pages/team-organization/domain/entities/participants/participants-filter.entity';
import { ParticipantsUpdateEntity } from '@pages/team-organization/domain/entities/participants/participants-update.entity';
import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { ParticipantsRepository } from '@pages/team-organization/domain/repositories/participants/participants-repository';
import { ParticipantsCreateMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-create.mapper';
import { participantsDeleteMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-delete.mapper';
import { participantsDisableMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-disable.mapper';
import { participantsEnableMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-enable.mapper';
import { ParticipantsFilterMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-filter.mapper';
import { ParticipantsUpdateMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-update.mapper';
import { ParticipantsMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants.mapper';
import { ParticipantsApi } from '@pages/team-organization/infrastructure/data/sources/participants/participants.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsRepositoryImpl implements ParticipantsRepository {
    private readonly api = inject(ParticipantsApi);
    private readonly mapper = inject(ParticipantsMapper);
    private readonly filterMapper = inject(ParticipantsFilterMapper);
    private readonly createMapper = inject(ParticipantsCreateMapper);
    private readonly updateMapper = inject(ParticipantsUpdateMapper);

    readAll(
        filter: ParticipantsFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ParticipantsEntity>> {
        return this.api
            .readAll(this.filterMapper.mapEntityToApi(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        payload: ParticipantsCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(this.createMapper.mapEntityToApi(payload));
    }

    update(
        payload: ParticipantsUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(this.updateMapper.mapEntityToApi(payload));
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
