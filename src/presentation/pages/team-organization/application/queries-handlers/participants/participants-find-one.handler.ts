import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParticipantsFindOneQuery } from '@presentation/pages/team-organization/application/queries/participants/participants-find-one.query';
import { ParticipantsFindOneUseCase } from '@presentation/pages/team-organization/application/use-cases/participants/participants-find-one.use-case';
import { ParticipantsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-find-one.entity';

@Injectable({ providedIn: 'root' })
export class ParticipantsFindOneHandler {
    constructor(private readonly useCase: ParticipantsFindOneUseCase) {}

    execute(
        command: ParticipantsFindOneQuery
    ): Observable<ParticipantsFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
