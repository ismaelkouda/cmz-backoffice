import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { TeamsCreateEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-create.entity';
import { TeamsFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-filter.entity';
import { TeamsUpdateEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-update.entity';
import { TeamsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class TeamsRepository {
    abstract readAll(
        filter: TeamsFilterEntity | null,
        page: string
    ): Observable<Paginate<TeamsEntity>>;
    abstract create(
        payload: TeamsCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        payload: TeamsUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(code: string): Observable<SimpleResponseDto<void>>;
    abstract enable(code: string): Observable<SimpleResponseDto<void>>;
    abstract disable(code: string): Observable<SimpleResponseDto<void>>;
}
