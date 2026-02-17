import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { TeamsCreateDto } from '@presentation/pages/team-organization/application/dto/teams/teams-create.dto';
import { TeamsDeleteDto } from '@presentation/pages/team-organization/application/dto/teams/teams-delete.dto';
import { TeamsDisableDto } from '@presentation/pages/team-organization/application/dto/teams/teams-disable.dto';
import { TeamsEnableDto } from '@presentation/pages/team-organization/application/dto/teams/teams-enable.dto';
import { TeamsFilterDto } from '@presentation/pages/team-organization/application/dto/teams/teams-filter.dto';
import { TeamsUpdateDto } from '@presentation/pages/team-organization/application/dto/teams/teams-update.dto';
import { TeamsCreateEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-create.entity';
import { TeamsDeleteEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-delete.entity';
import { TeamsDisableEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-disable.entity';
import { TeamsEnableEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-enable.entity';
import { TeamsFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-filter.entity';
import { TeamsUpdateEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-update.entity';
import { TeamsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams.entity';
import { TeamsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-repository';
import { TeamsCreateVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-create.vo';
import { TeamsDeleteVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-delete.vo';
import { TeamsDisableVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-disable.vo';
import { TeamsEnableVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-enable.vo';
import { TeamsFilterVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-filter.vo';
import { TeamsUpdateVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-update.vo';

@Injectable({
    providedIn: 'root',
})
export class TeamsUseCase {
    private readonly repository = inject(TeamsRepository);

    execute(
        filterDto: TeamsFilterDto | null,
        page: string
    ): Observable<Paginate<TeamsEntity>> {
        const vo = TeamsFilterVo.fromDto(filterDto);
        const entity = TeamsFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
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
