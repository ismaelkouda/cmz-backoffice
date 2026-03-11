import { Injectable, inject } from '@angular/core';
import { TeamsFindOneFilterDto } from '@pages/team-organization/application/dto/teams/teams-find-one-filter.dto';
import { TeamsFindOneFilterEntity } from '@pages/team-organization/domain/entities/teams/teams-find-one-filter.entity';
import { TeamsFindOneEntity } from '@pages/team-organization/domain/entities/teams/teams-find-one.entity';
import { TeamsFindOneRepository } from '@pages/team-organization/domain/repositories/teams/teams-find-one-repository';
import { TeamsFindOneFilterVo } from '@pages/team-organization/domain/value-objects/teams/teams-find-one-filter.vo';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TeamsFindOneUseCase {
    private readonly repository = inject(TeamsFindOneRepository);

    execute(filterDto: TeamsFindOneFilterDto): Observable<TeamsFindOneEntity> {
        const vo = TeamsFindOneFilterVo.fromDto(filterDto);
        const filter = TeamsFindOneFilterEntity.fromVo(vo);
        return this.repository.read(filter);
    }
}
