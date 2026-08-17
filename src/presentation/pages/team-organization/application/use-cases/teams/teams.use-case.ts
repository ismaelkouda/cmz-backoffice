import { inject, Injectable } from '@angular/core';
import { TeamsDeleteDto } from '@pages/team-organization/application/dto/teams/teams-delete.dto';
import { TeamsDisableDto } from '@pages/team-organization/application/dto/teams/teams-disable.dto';
import { TeamsEnableDto } from '@pages/team-organization/application/dto/teams/teams-enable.dto';
import { TeamsFilterDto } from '@pages/team-organization/application/dto/teams/teams-filter.dto';
import { TeamsCreateContract } from '@pages/team-organization/domain/contracts/teams/teams-create.contract';
import { TeamsUpdateContract } from '@pages/team-organization/domain/contracts/teams/teams-update.contract';
import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import { TeamsRepository } from '@pages/team-organization/domain/repositories/teams/teams-repository';
import { teamsCreateVo } from '@pages/team-organization/domain/value-objects/teams/teams-create.vo';
import { teamsDeleteVo } from '@pages/team-organization/domain/value-objects/teams/teams-delete.vo';
import { teamsDisableVo } from '@pages/team-organization/domain/value-objects/teams/teams-disable.vo';
import { teamsEnableVo } from '@pages/team-organization/domain/value-objects/teams/teams-enable.vo';
import { teamsFilterVo } from '@pages/team-organization/domain/value-objects/teams/teams-filter.vo';
import { teamsUpdateVo } from '@pages/team-organization/domain/value-objects/teams/teams-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TeamsUseCase {
    private readonly repository = inject(TeamsRepository);

    execute(
        filterDto: TeamsFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TeamsEntity>> {
        return this.repository.readAll(teamsFilterVo(filterDto), page, options);
    }

    create(
        createDto: TeamsCreateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.create(teamsCreateVo(createDto)));
    }

    update(
        updateDto: TeamsUpdateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.update(teamsUpdateVo(updateDto)));
    }

    enable(enableDto: TeamsEnableDto): Observable<SimpleResponseDto<void>> {
        return this.repository.enable(teamsEnableVo(enableDto));
    }

    disable(disableDto: TeamsDisableDto): Observable<SimpleResponseDto<void>> {
        return this.repository.disable(teamsDisableVo(disableDto));
    }

    delete(deleteDto: TeamsDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(teamsDeleteVo(deleteDto));
    }
}
