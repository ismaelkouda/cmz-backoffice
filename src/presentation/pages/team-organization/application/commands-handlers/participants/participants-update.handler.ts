import { Injectable, inject } from '@angular/core';
import { ParticipantsUpdateCommand } from '@pages/team-organization/application/commands/participants/participants-update.command';
import { ParticipantsUseCase } from '@pages/team-organization/application/use-cases/participants/participants.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsUpdateHandler {
    private readonly useCase = inject(ParticipantsUseCase);

    execute(
        command: ParticipantsUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            phone: command.phone,
            role: command?.role,
            team: command?.team,
        });
    }
}
