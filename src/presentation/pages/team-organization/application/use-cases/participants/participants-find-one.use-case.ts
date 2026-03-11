import { inject, Injectable } from '@angular/core';
import { ParticipantsFindOneFilterDto } from '@pages/team-organization/application/dto/participants/participants-find-one-filter.dto';
import { ParticipantsFindOneFilterEntity } from '@pages/team-organization/domain/entities/participants/participants-find-one-filter.entity';
import { ParticipantsFindOneEntity } from '@pages/team-organization/domain/entities/participants/participants-find-one.entity';
import { ParticipantsFindOneRepository } from '@pages/team-organization/domain/repositories/participants/participants-find-one-repository';
import { ParticipantsFindOneFilterVo } from '@pages/team-organization/domain/value-objects/participants/participants-find-one-filter.vo';
import { Observable } from 'rxjs';

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
        return this.repository.execute(filter);
    }
}
