import { inject, Injectable } from '@angular/core';
import { TeamsDeleteDto } from '@pages/team-organization/application/dto/teams/teams-delete.dto';
import { TeamsDisableDto } from '@pages/team-organization/application/dto/teams/teams-disable.dto';
import { TeamsEnableDto } from '@pages/team-organization/application/dto/teams/teams-enable.dto';
import { TeamsCreateValidateContract } from '@pages/team-organization/domain/contracts/teams/teams-create.validate-contract';
import { TeamsUpdateValidateContract } from '@pages/team-organization/domain/contracts/teams/teams-update.validate-contract';
import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import { TeamsRepository } from '@pages/team-organization/domain/repositories/teams/teams-repository';
import { TeamsFilterVo } from '@pages/team-organization/domain/value-objects/teams/teams-filter.vo';
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
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TeamsRepositoryImpl implements TeamsRepository {
    private readonly api = inject(TeamsApi);
    private readonly mapper = inject(TeamsMapper);
    private readonly mapperFilter = inject(TeamsFilterMapper);

    readAll(
        filter: TeamsFilterVo,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TeamsEntity>> {
        const paramsDto = this.mapperFilter.map(filter);
        return this.api
            .readAll(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        payload: TeamsCreateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = TeamsCreateMapper(payload);
        return this.api.create(paramsDto);
    }

    update(
        payload: TeamsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = teamsUpdateMapper(payload);
        return this.api.update(paramsDto);
    }

    delete(dto: TeamsDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.api.delete(teamsDeleteMapper(dto));
    }

    enable(dto: TeamsEnableDto): Observable<SimpleResponseDto<void>> {
        return this.api.enable(teamsEnableMapper(dto));
    }

    disable(dto: TeamsDisableDto): Observable<SimpleResponseDto<void>> {
        return this.api.disable(teamsDisableMapper(dto));
    }
}
