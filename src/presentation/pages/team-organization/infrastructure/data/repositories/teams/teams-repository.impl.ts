import { inject, Injectable } from '@angular/core';
import { TeamsCreateEntity } from '@pages/team-organization/domain/entities/teams/teams-create.entity';
import { TeamsDeleteEntity } from '@pages/team-organization/domain/entities/teams/teams-delete.entity';
import { TeamsDisableEntity } from '@pages/team-organization/domain/entities/teams/teams-disable.entity';
import { TeamsEnableEntity } from '@pages/team-organization/domain/entities/teams/teams-enable.entity';
import { TeamsFilterEntity } from '@pages/team-organization/domain/entities/teams/teams-filter.entity';
import { TeamsUpdateEntity } from '@pages/team-organization/domain/entities/teams/teams-update.entity';
import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import { TeamsRepository } from '@pages/team-organization/domain/repositories/teams/teams-repository';
import { TeamsCreateMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-create.mapper';
import { teamsDeleteMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-delete.mapper';
import { teamsDisableMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-disable.mapper';
import { teamsEnableMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-enable.mapper';
import { TeamsFilterMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-filter.mapper';
import { teamsUpdateMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-update.mapper';
import { TeamsMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams.mapper';
import { TeamsApi } from '@pages/team-organization/infrastructure/data/sources/teams/teams.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TeamsRepositoryImpl implements TeamsRepository {
    private readonly api = inject(TeamsApi);
    private readonly mapper = inject(TeamsMapper);
    private readonly mapperFilter = inject(TeamsFilterMapper);

    readAll(
        entity: TeamsFilterEntity,
        page: string
    ): Observable<Paginate<TeamsEntity>> {
        const paramsDto = this.mapperFilter.map(entity);
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

    delete(entity: TeamsDeleteEntity): Observable<SimpleResponseDto<void>> {
        return this.api.delete(teamsDeleteMapper(entity));
    }

    enable(entity: TeamsEnableEntity): Observable<SimpleResponseDto<void>> {
        return this.api.enable(teamsEnableMapper(entity));
    }

    disable(entity: TeamsDisableEntity): Observable<SimpleResponseDto<void>> {
        return this.api.disable(teamsDisableMapper(entity));
    }
}
