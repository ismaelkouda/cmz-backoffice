import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ParticipantsCreateCommand } from '@presentation/pages/team-organization/application/commands/participants/participants-create.command';
import { ParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/participants/participants.use-case';

@Injectable({ providedIn: 'root' })
export class ParticipantsCreateHandler {
    constructor(private readonly useCase: ParticipantsUseCase) {}

    execute(
        command: ParticipantsCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            phone: command.phone,
            role: command.role,
        });
    }
}
