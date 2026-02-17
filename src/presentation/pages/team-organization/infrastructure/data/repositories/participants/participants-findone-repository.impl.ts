import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ParticipantsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-findone-filter.entity';
import { ParticipantsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-findone.entity';
import { ParticipantsFindonRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-findone-repository';
import { participantsFindOneFilterMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-findone-filter.mapper';
import { ParticipantsFindonMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-findone.mapper';
import { ParticipantsFindonApi } from '@presentation/pages/team-organization/infrastructure/data/sources/participants/participants-findone.api';

@Injectable({ providedIn: 'root' })
export class ParticipantsFindonRepositoryImpl implements ParticipantsFindonRepository {
    private readonly api = inject(ParticipantsFindonApi);
    private readonly mapper = inject(ParticipantsFindonMapper);

    read(
        filter: ParticipantsFindOneFilterEntity
    ): Observable<ParticipantsFindOneEntity> {
        const paramsDto = participantsFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
