import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { TeamsCreateEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-create.entity';
import { TeamsDeleteEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-delete.entity';
import { TeamsDisableEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-disable.entity';
import { TeamsEnableEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-enable.entity';
import { TeamsFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-filter.entity';
import { TeamsUpdateEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-update.entity';
import { TeamsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class TeamsRepository {
    abstract readAll(
        entity: TeamsFilterEntity | null,
        page: string
    ): Observable<Paginate<TeamsEntity>>;
    abstract create(
        entity: TeamsCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: TeamsUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: TeamsDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract enable(
        entity: TeamsEnableEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(
        entity: TeamsDisableEntity
    ): Observable<SimpleResponseDto<void>>;
}
