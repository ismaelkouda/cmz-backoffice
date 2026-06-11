import { inject, Injectable } from '@angular/core';
import { TeamsParticipantsAssignCommand } from '@pages/team-organization/application/commands/teams/teams-participants-assign.command';
import { TeamsParticipantsReassignCommand } from '@pages/team-organization/application/commands/teams/teams-participants-reassign.command';
import { TeamsParticipantsFilterDto } from '@pages/team-organization/application/dto/teams/teams-participants-filter.dto';
import { TeamsParticipantsRemoveDto } from '@pages/team-organization/application/dto/teams/teams-participants-remove.dto';
import { TeamsParticipantsAssignEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-assign.entity';
import { TeamsParticipantsFilterEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-filter.entity';
import { TeamsParticipantsReassignEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-reassign.entity';
import { TeamsParticipantsRemoveEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-remove.entity';
import { TeamsParticipantsEntity } from '@pages/team-organization/domain/entities/teams/teams-participants.entity';
import { TeamsParticipantsRepository } from '@pages/team-organization/domain/repositories/teams/teams-participants-repository';
import { TeamsParticipantsAssignVo } from '@pages/team-organization/domain/value-objects/teams/teams-participants-assign.vo';
import { TeamsParticipantsFilterVo } from '@pages/team-organization/domain/value-objects/teams/teams-participants-filter.vo';
import { TeamsParticipantsReassignVo } from '@pages/team-organization/domain/value-objects/teams/teams-participants-reassign.vo';
import { TeamsParticipantsRemoveVo } from '@pages/team-organization/domain/value-objects/teams/teams-participants-remove.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TeamsParticipantsUseCase {
    private readonly repository = inject(TeamsParticipantsRepository);

    execute(
        filterDto: TeamsParticipantsFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TeamsParticipantsEntity>> {
        const vo = TeamsParticipantsFilterVo.fromDto(filterDto);
        const entity = TeamsParticipantsFilterEntity.toEntity(vo);
        return this.repository.readAll(entity, page, options);
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
