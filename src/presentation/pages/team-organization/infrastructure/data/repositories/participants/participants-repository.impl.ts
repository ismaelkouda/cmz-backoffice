import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { ParticipantsFilterEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-filter.entity';
import { ParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants.entity';
import { ParticipantsRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-repository';
import { ParticipantsCreateVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-create.vo';
import { ParticipantsUpdateVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-update.vo';
import { participantsCreateMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-create.mapper';
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
        const paramsDto = participantsFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: ParticipantsCreateVo): Observable<SimpleResponseDto<void>> {
        const paramsDto = participantsCreateMapper(payload);
        return this.api.create(paramsDto);
    }

    update(payload: ParticipantsUpdateVo): Observable<SimpleResponseDto<void>> {
        const paramsDto = participantsUpdateMapper(payload);
        return this.api.update(paramsDto);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        console.log('id3', code);
        return this.api.delete(code);
    }

    enable(code: string): Observable<SimpleResponseDto<void>> {
        return this.api.enable(code);
    }

    disable(code: string): Observable<SimpleResponseDto<void>> {
        return this.api.disable(code);
    }
}
