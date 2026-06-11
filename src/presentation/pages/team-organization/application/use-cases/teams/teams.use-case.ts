import { inject, Injectable } from '@angular/core';
import { TeamsCreateDto } from '@pages/team-organization/application/dto/teams/teams-create.dto';
import { TeamsDeleteDto } from '@pages/team-organization/application/dto/teams/teams-delete.dto';
import { TeamsDisableDto } from '@pages/team-organization/application/dto/teams/teams-disable.dto';
import { TeamsEnableDto } from '@pages/team-organization/application/dto/teams/teams-enable.dto';
import { TeamsFilterDto } from '@pages/team-organization/application/dto/teams/teams-filter.dto';
import { TeamsUpdateDto } from '@pages/team-organization/application/dto/teams/teams-update.dto';
import { TeamsCreateEntity } from '@pages/team-organization/domain/entities/teams/teams-create.entity';
import { TeamsDeleteEntity } from '@pages/team-organization/domain/entities/teams/teams-delete.entity';
import { TeamsDisableEntity } from '@pages/team-organization/domain/entities/teams/teams-disable.entity';
import { TeamsEnableEntity } from '@pages/team-organization/domain/entities/teams/teams-enable.entity';
import { TeamsFilterEntity } from '@pages/team-organization/domain/entities/teams/teams-filter.entity';
import { TeamsUpdateEntity } from '@pages/team-organization/domain/entities/teams/teams-update.entity';
import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import { TeamsRepository } from '@pages/team-organization/domain/repositories/teams/teams-repository';
import { TeamsCreateVo } from '@pages/team-organization/domain/value-objects/teams/teams-create.vo';
import { TeamsDeleteVo } from '@pages/team-organization/domain/value-objects/teams/teams-delete.vo';
import { TeamsDisableVo } from '@pages/team-organization/domain/value-objects/teams/teams-disable.vo';
import { TeamsEnableVo } from '@pages/team-organization/domain/value-objects/teams/teams-enable.vo';
import { TeamsFilterVo } from '@pages/team-organization/domain/value-objects/teams/teams-filter.vo';
import { TeamsUpdateVo } from '@pages/team-organization/domain/value-objects/teams/teams-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

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
        const vo = TeamsFilterVo.fromDto(filterDto);
        const entity = TeamsFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page, options);
    }

    create(createDto: TeamsCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = TeamsCreateVo.fromDto(createDto);
        const entity = TeamsCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(updateDto: TeamsUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = TeamsUpdateVo.fromDto(updateDto);
        const entity = TeamsUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    enable(enableDto: TeamsEnableDto): Observable<SimpleResponseDto<void>> {
        const vo = TeamsEnableVo.fromDto(enableDto);
        const entity = TeamsEnableEntity.fromVo(vo);
        return this.repository.enable(entity);
    }

    disable(disableDto: TeamsDisableDto): Observable<SimpleResponseDto<void>> {
        const vo = TeamsDisableVo.fromDto(disableDto);
        const entity = TeamsDisableEntity.fromVo(vo);
        return this.repository.disable(entity);
    }

    delete(deleteDto: TeamsDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = TeamsDeleteVo.fromDto(deleteDto);
        const entity = TeamsDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
