import { Injectable } from '@angular/core';
import { TeamsCreateEntity } from '@pages/team-organization/domain/entities/teams/teams-create.entity';
import { TeamsDeleteEntity } from '@pages/team-organization/domain/entities/teams/teams-delete.entity';
import { TeamsDisableEntity } from '@pages/team-organization/domain/entities/teams/teams-disable.entity';
import { TeamsEnableEntity } from '@pages/team-organization/domain/entities/teams/teams-enable.entity';
import { TeamsFilterEntity } from '@pages/team-organization/domain/entities/teams/teams-filter.entity';
import { TeamsUpdateEntity } from '@pages/team-organization/domain/entities/teams/teams-update.entity';
import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class TeamsRepository {
    abstract readAll(
        entity: TeamsFilterEntity | null,
        page: string,
        options?: FetchOptions
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
