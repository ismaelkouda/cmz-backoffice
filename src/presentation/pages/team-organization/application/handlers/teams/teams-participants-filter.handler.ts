// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

// import { TeamsParticipantsFilterCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-fllter.command';
// import { TeamsParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-participants.use-case';

// @Injectable({ providedIn: 'root' })
// export class TeamsParticipantsFilterHandler {
//     constructor(private readonly useCase: TeamsParticipantsUseCase) {}

//     execute(
//         command: TeamsParticipantsFilterCommand
//     ): Observable<SimpleResponseDto<void>> {
//         return this.useCase.readAll({
//             uniqId: command.uniqId,
//             participants: command.participants,
//         });
//     }
// }
