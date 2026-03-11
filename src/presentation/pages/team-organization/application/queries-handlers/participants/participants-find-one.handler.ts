import { Injectable } from '@angular/core';
import { ParticipantsFindOneQuery } from '@pages/team-organization/application/queries/participants/participants-find-one.query';
import { ParticipantsFindOneUseCase } from '@pages/team-organization/application/use-cases/participants/participants-find-one.use-case';
import { ParticipantsFindOneEntity } from '@pages/team-organization/domain/entities/participants/participants-find-one.entity';
import { Observable } from 'rxjs';

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
