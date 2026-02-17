import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { TeamsParticipantsAssignCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-assign.command';
import { TeamsParticipantsReassignCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-reassign.command';
import { TeamsParticipantsFilterDto } from '@presentation/pages/team-organization/application/dto/teams/teams-participants-filter.dto';
import { TeamsParticipantsRemoveDto } from '@presentation/pages/team-organization/application/dto/teams/teams-participants-remove.dto';
import { TeamsParticipantsAssignEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-assign.entity';
import { TeamsParticipantsFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-filter.entity';
import { TeamsParticipantsReassignEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-reassign.entity';
import { TeamsParticipantsRemoveEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-remove.entity';
import { TeamsParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants.entity';
import { TeamsParticipantsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-participants-repository';
import { TeamsParticipantsAssignVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-participants-assign.vo';
import { TeamsParticipantsFilterVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-participants-filter.vo';
import { TeamsParticipantsReassignVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-participants-reassign.vo';
import { TeamsParticipantsRemoveVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-participants-remove.vo';

export class TeamsParticipantsUseCase {
    private readonly repository = inject(TeamsParticipantsRepository);

    execute(
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

    assign(
        command: TeamsParticipantsAssignCommand
    ): Observable<SimpleResponseDto<void>> {
        console.log('command', command);
        const vo = TeamsParticipantsAssignVo.create(command);
        const entity = TeamsParticipantsAssignEntity.fromVo(vo);
        return this.repository.assign(entity);
    }

    remove(
        dto: TeamsParticipantsRemoveDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = TeamsParticipantsRemoveVo.create(dto);
        const entity = TeamsParticipantsRemoveEntity.fromVo(vo);
        return this.repository.remove(entity);
    }
}
