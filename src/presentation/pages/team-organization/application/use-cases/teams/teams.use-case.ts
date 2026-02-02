import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { TeamsCreateDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-create.dto';
import { TeamsFilterDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-filter.dto';
import { TeamsUpdateDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-update.dto';
import { TeamsCreateEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-create.entity';
import { TeamsFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-filter.entity';
import { TeamsUpdateEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-update.entity';
import { TeamsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams.entity';
import { TeamsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-repository';
import { TeamsCreateVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-create.vo';
import { TeamsFilterVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-filter.vo';
import { TeamsUpdateVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-update.vo';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TeamsUseCase {
    private readonly repository = inject(TeamsRepository);

    readAll(
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

    enable(id: string): Observable<SimpleResponseDto<void>> {
        return this.repository.enable(id);
    }

    disable(id: string): Observable<SimpleResponseDto<void>> {
        return this.repository.disable(id);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(code);
    }
}
