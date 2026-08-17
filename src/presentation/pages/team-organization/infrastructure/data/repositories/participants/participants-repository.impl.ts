import { inject, Injectable } from '@angular/core';
import { ParticipantsDeleteDto } from '@pages/team-organization/application/dto/participants/participants-delete.dto';
import { ParticipantsDisableDto } from '@pages/team-organization/application/dto/participants/participants-disable.dto';
import { ParticipantsEnableDto } from '@pages/team-organization/application/dto/participants/participants-enable.dto';
import { ParticipantsCreateValidateContract } from '@pages/team-organization/domain/contracts/participants/participants-create.validate-contract';
import { ParticipantsUpdateValidateContract } from '@pages/team-organization/domain/contracts/participants/participants-update.validate-contract';
import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { ParticipantsRepository } from '@pages/team-organization/domain/repositories/participants/participants-repository';
import { ParticipantsFilterVo } from '@pages/team-organization/domain/value-objects/participants/participants-filter.vo';
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
        filter: ParticipantsFilterVo,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ParticipantsEntity>> {
        return this.api
            .readAll(this.filterMapper.mapEntityToApi(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        payload: ParticipantsCreateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(this.createMapper.mapEntityToApi(payload));
    }

    update(
        payload: ParticipantsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(this.updateMapper.mapEntityToApi(payload));
    }

    delete(dto: ParticipantsDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.api.delete(participantsDeleteMapper(dto));
    }

    enable(dto: ParticipantsEnableDto): Observable<SimpleResponseDto<void>> {
        return this.api.enable(participantsEnableMapper(dto));
    }

    disable(dto: ParticipantsDisableDto): Observable<SimpleResponseDto<void>> {
        return this.api.disable(participantsDisableMapper(dto));
    }
}
