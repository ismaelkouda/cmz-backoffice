import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { ParticipantsCreateDto } from '@presentation/pages/team-organization/application/dtos/participants/participants-create.dto';
import { ParticipantsFilterDto } from '@presentation/pages/team-organization/application/dtos/participants/participants-filter.dto';
import { ParticipantsUpdateDto } from '@presentation/pages/team-organization/application/dtos/participants/participants-update.dto';
import { ParticipantsCreateEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-create.entity';
import { ParticipantsFilterEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-filter.entity';
import { ParticipantsUpdateEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-update.entity';
import { ParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants.entity';
import { ParticipantsRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-repository';
import { ParticipantsCreateVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-create.vo';
import { ParticipantsFilterVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-filter.vo';
import { ParticipantsUpdateVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-update.vo';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsUseCase {
    private readonly repository = inject(ParticipantsRepository);

    readAll(
        filterDto: ParticipantsFilterDto | null,
        page: string
    ): Observable<Paginate<ParticipantsEntity>> {
        const vo = ParticipantsFilterVo.fromDto(filterDto);
        const entity = ParticipantsFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }

    create(
        createDto: ParticipantsCreateDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ParticipantsCreateVo.fromDto(createDto);
        const entity = ParticipantsCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(
        updateDto: ParticipantsUpdateDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ParticipantsUpdateVo.fromDto(updateDto);
        const entity = ParticipantsUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    delete(id: string): Observable<SimpleResponseDto<void>> {
        console.log('id2', id);
        return this.repository.delete(id);
    }

    enable(id: string): Observable<SimpleResponseDto<void>> {
        return this.repository.enable(id);
    }

    disable(id: string): Observable<SimpleResponseDto<void>> {
        return this.repository.disable(id);
    }
}
