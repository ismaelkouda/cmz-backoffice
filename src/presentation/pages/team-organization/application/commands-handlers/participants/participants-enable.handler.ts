import { participantsEnableCommandMapper } from '@pages/team-organization/application/commands-mappers/participants/participants-enable.mapper';
import { Injectable, inject } from '@angular/core';
import { ParticipantsEnableCommand } from '@pages/team-organization/application/commands/participants/participants-enable.command';
import { ParticipantsUseCase } from '@pages/team-organization/application/use-cases/participants/participants.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsEnableHandler {
    private readonly useCase = inject(ParticipantsUseCase);

    execute(
        command: ParticipantsEnableCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable(participantsEnableCommandMapper(command));
    }
}
