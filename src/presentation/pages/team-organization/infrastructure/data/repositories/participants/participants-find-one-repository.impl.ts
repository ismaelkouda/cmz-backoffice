import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ParticipantsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-find-one-filter.entity';
import { ParticipantsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-find-one.entity';
import { ParticipantsFindOneRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-find-one-repository';
import { participantsFindOneFilterMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-find-one-filter.mapper';
import { ParticipantsFindOneMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-find-one.mapper';
import { ParticipantsFindOneApi } from '@presentation/pages/team-organization/infrastructure/data/sources/participants/participants-find-one.api';

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
