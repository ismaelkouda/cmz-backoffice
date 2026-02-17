import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ParticipantsSelectEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-select.entity';
import { ParticipantsSelectRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-select-repository';
import { ParticipantsSelectMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-select.mapper';
import { ParticipantsSelectApi } from '@presentation/pages/team-organization/infrastructure/data/sources/participants/participants-select.api';

@Injectable({ providedIn: 'root' })
export class ParticipantsSelectRepositoryImpl implements ParticipantsSelectRepository {
    private readonly api = inject(ParticipantsSelectApi);
    private readonly mapper = inject(ParticipantsSelectMapper);

    readAll(filter: string | null): Observable<ParticipantsSelectEntity[]> {
        return this.api
            .readAll(filter)
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
