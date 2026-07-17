import { Injectable } from '@angular/core';
import { TeamsDeleteDto } from '@pages/team-organization/application/dto/teams/teams-delete.dto';
import { TeamsDisableDto } from '@pages/team-organization/application/dto/teams/teams-disable.dto';
import { TeamsEnableDto } from '@pages/team-organization/application/dto/teams/teams-enable.dto';
import { TeamsCreateValidateContract } from '@pages/team-organization/domain/contracts/teams/teams-create.validate-contract';
import { TeamsUpdateValidateContract } from '@pages/team-organization/domain/contracts/teams/teams-update.validate-contract';
import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import { TeamsFilterVo } from '@pages/team-organization/domain/value-objects/teams/teams-filter.vo';
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
        filter: TeamsFilterVo | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TeamsEntity>>;
    abstract create(
        props: TeamsCreateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        props: TeamsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(dto: TeamsDeleteDto): Observable<SimpleResponseDto<void>>;
    abstract enable(dto: TeamsEnableDto): Observable<SimpleResponseDto<void>>;
    abstract disable(
        dto: TeamsDisableDto
    ): Observable<SimpleResponseDto<void>>;
}
