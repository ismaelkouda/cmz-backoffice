import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { TeamsCreateEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-create.entity';
import { TeamsFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-filter.entity';
import { TeamsUpdateEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-update.entity';
import { TeamsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams.entity';
import { TeamsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-repository';
import { TeamsCreateMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams-create.mapper';
import { teamsFilterMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams-filter.mapper';
import { teamsUpdateMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams-update.mapper';
import { TeamsMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams.mapper';
import { TeamsApi } from '@presentation/pages/team-organization/infrastructure/data/sources/teams/teams.api';

@Injectable({
    providedIn: 'root'
})
export class TeamsRepositoryImpl implements TeamsRepository {
    private readonly api = inject(TeamsApi);
    private readonly mapper = inject(TeamsMapper);

    readAll(
        filter: TeamsFilterEntity,
        page: string
    ): Observable<Paginate<TeamsEntity>> {
        const paramsDto = teamsFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: TeamsCreateEntity): Observable<SimpleResponseDto<void>> {
        const paramsDto = TeamsCreateMapper(payload);
        return this.api.create(paramsDto);
    }

    update(payload: TeamsUpdateEntity): Observable<SimpleResponseDto<void>> {
        const paramsDto = teamsUpdateMapper(payload);
        return this.api.update(paramsDto);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.api.delete(code);
    }

    enable(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.enable(id);
    }

    disable(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.disable(id);
    }
}
