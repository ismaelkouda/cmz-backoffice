import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParticipantsFindOneFilterDto } from '@presentation/pages/team-organization/application/dto/participants/participants-find-one-filter.dto';
import { ParticipantsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-find-one-filter.entity';
import { ParticipantsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-find-one.entity';
import { ParticipantsFindOneRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-find-one-repository';
import { ParticipantsFindOneFilterVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsFindOneUseCase {
    private readonly repository = inject(ParticipantsFindOneRepository);

    execute(
        filterDto: ParticipantsFindOneFilterDto
    ): Observable<ParticipantsFindOneEntity> {
        const vo = ParticipantsFindOneFilterVo.fromDto(filterDto);
        const filter = ParticipantsFindOneFilterEntity.fromVo(vo);
        return this.repository.read(filter);
    }
}
