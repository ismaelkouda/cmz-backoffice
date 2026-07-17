import { participantsDeleteCommandMapper } from '@pages/team-organization/application/commands-mappers/participants/participants-delete.mapper';
import { Injectable, inject } from '@angular/core';
import { ParticipantsDeleteCommand } from '@pages/team-organization/application/commands/participants/participants-delete.command';
import { ParticipantsUseCase } from '@pages/team-organization/application/use-cases/participants/participants.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsDeleteHandler {
    private readonly useCase = inject(ParticipantsUseCase);

    execute(
        command: ParticipantsDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete(participantsDeleteCommandMapper(command));
    }
}
