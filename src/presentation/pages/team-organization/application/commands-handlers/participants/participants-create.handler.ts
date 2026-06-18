import { Injectable, inject } from '@angular/core';
import { ParticipantsCreateCommand } from '@pages/team-organization/application/commands/participants/participants-create.command';
import { ParticipantsUseCase } from '@pages/team-organization/application/use-cases/participants/participants.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsCreateHandler {
    private readonly useCase = inject(ParticipantsUseCase);

    execute(
        command: ParticipantsCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            phone: command.phone,
            role: command?.role,
            team: command?.team,
        });
    }
}
