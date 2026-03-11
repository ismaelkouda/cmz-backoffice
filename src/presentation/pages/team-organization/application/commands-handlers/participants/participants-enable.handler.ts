import { Injectable } from '@angular/core';
import { ParticipantsEnableCommand } from '@pages/team-organization/application/commands/participants/participants-enable.command';
import { ParticipantsUseCase } from '@pages/team-organization/application/use-cases/participants/participants.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
