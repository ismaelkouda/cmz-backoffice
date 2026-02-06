import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParticipantsFindOneFilterDto } from '@presentation/pages/team-organization/application/dtos/participants/participants-findone-filter.dto';
import { ParticipantsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-findone-filter.entity';
import { ParticipantsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-findone.entity';
import { ParticipantsFindonRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-findone-repository';
import { ParticipantsFindOneFilterVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-findone-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsFindonUseCase {
    private readonly repository = inject(ParticipantsFindonRepository);

    read(
        filterDto: ParticipantsFindOneFilterDto
    ): Observable<ParticipantsFindOneEntity> {
        const vo = ParticipantsFindOneFilterVo.fromDto(filterDto);
        const filter = ParticipantsFindOneFilterEntity.fromVo(vo);
        return this.repository.read(filter);
    }
}
