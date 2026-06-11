import { inject, Injectable } from '@angular/core';
import { ParticipantsSelectEntity } from '@pages/team-organization/domain/entities/participants/participants-select.entity';
import { ParticipantsSelectRepository } from '@pages/team-organization/domain/repositories/participants/participants-select-repository';
import { ParticipantsSelectMapper } from '@pages/team-organization/infrastructure/data/mappers/participants/participants-select.mapper';
import { ParticipantsSelectApi } from '@pages/team-organization/infrastructure/data/sources/participants/participants-select.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsSelectRepositoryImpl implements ParticipantsSelectRepository {
    private readonly api = inject(ParticipantsSelectApi);
    private readonly mapper = inject(ParticipantsSelectMapper);

    readAll(options?: FetchOptions): Observable<ParticipantsSelectEntity[]> {
        return this.api
            .readAll(options)
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
