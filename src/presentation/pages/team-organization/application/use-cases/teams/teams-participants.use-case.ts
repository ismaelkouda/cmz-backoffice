import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { TeamsParticipantsFilterDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-participants-filter.dto';
import { TeamsParticipantsReassignDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-participants-reassign.dto';
import { TeamsParticipantsRemoveDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-participants-remove.dto';
import { TeamsParticipantsFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-filter.entity';
import { TeamsParticipantsReassignEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-reassign.entity';
import { TeamsParticipantsRemoveEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-remove.entity';
import { TeamsParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants.entity';
import { TeamsParticipantsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-participants-repository';
import { TeamsParticipantsFilterVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-participants-filter.vo';
import { TeamsParticipantsReassignVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-participants-reassign.vo';
import { TeamsParticipantsRemoveVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-participants-remove.vo';
import { TeamsParticipantsReassignCommand } from '../../commands/teams/teams-participants-reassign.command';

export class TeamsParticipantsUseCase {
    private readonly repository = inject(TeamsParticipantsRepository);

    readAll(
        filterDto: TeamsParticipantsFilterDto | null,
        page: string
    ): Observable<Paginate<TeamsParticipantsEntity>> {
        const vo = TeamsParticipantsFilterVo.fromDto(filterDto);
        const entity = TeamsParticipantsFilterEntity.toEntity(vo);
        return this.repository.readAll(entity, page);
    }

    reassign(
        command: TeamsParticipantsReassignCommand
    ): Observable<SimpleResponseDto<void>> {
        const vo = TeamsParticipantsReassignVo.create(command);
        const entity = TeamsParticipantsReassignEntity.fromVo(vo);
        return this.repository.reassign(entity);
    }

    remove(
        dto: TeamsParticipantsRemoveDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = TeamsParticipantsRemoveVo.fromDto(dto);
        const entity = TeamsParticipantsRemoveEntity.toEntity(vo);
        return this.repository.remove(entity);
    }
}
