import { inject, Injectable } from '@angular/core';
import { ParticipantsFindOneFilterEntity } from '@pages/team-organization/domain/entities/participants/participants-find-one-filter.entity';
import { ParticipantsFindOneEntity } from '@pages/team-organization/domain/entities/participants/participants-find-one.entity';
import { ParticipantsFindOneRepository } from '@pages/team-organization/domain/repositories/participants/participants-find-one-repository';
import { participantsFindOneFilterMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-find-one-filter.mapper';
import { ParticipantsFindOneMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-find-one.mapper';
import { ParticipantsFindOneApi } from '@pages/team-organization/infrastructure/data/sources/participants/participants-find-one.api';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsFindOneRepositoryImpl implements ParticipantsFindOneRepository {
    private readonly api = inject(ParticipantsFindOneApi);
    private readonly mapper = inject(ParticipantsFindOneMapper);

    execute(
        filter: ParticipantsFindOneFilterEntity
    ): Observable<ParticipantsFindOneEntity> {
        const paramsDto = participantsFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
