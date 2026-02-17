import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ParticipantsUpdateCommand } from '@presentation/pages/team-organization/application/commands/participants/participants-update.command';
import { ParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/participants/participants.use-case';

@Injectable({ providedIn: 'root' })
export class ParticipantsUpdateHandler {
    constructor(private readonly useCase: ParticipantsUseCase) {}

    execute(
        command: ParticipantsUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            phone: command.phone,
            role: command.role,
        });
    }
}
