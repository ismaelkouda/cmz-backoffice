import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ParticipantsEnableCommand } from '@presentation/pages/team-organization/application/commands/participants/participants-enable.command';
import { ParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/participants/participants.use-case';

@Injectable({ providedIn: 'root' })
export class ParticipantsEnableHandler {
    constructor(private readonly useCase: ParticipantsUseCase) {}

    execute(
        command: ParticipantsEnableCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable({
            uniqId: command.uniqId,
        });
    }
}
