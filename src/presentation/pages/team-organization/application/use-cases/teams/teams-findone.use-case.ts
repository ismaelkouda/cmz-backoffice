import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsFindOneFilterDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-findone-filter.dto';
import { TeamsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-findone-filter.entity';
import { TeamsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-findone.entity';
import { TeamsFindOneRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-findone-repository';
import { TeamsFindOneFilterVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-findone-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class TeamsFindOneUseCase {
    private readonly repository = inject(TeamsFindOneRepository);

    read(filterDto: TeamsFindOneFilterDto): Observable<TeamsFindOneEntity> {
        const vo = TeamsFindOneFilterVo.fromDto(filterDto);
        const filter = TeamsFindOneFilterEntity.fromVo(vo);
        return this.repository.read(filter);
    }
}
