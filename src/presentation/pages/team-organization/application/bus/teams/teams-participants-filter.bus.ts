// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// import { TeamsParticipantsFilterCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-fllter.command';
// import { TeamsParticipantsFilterHandler } from '@presentation/pages/team-organization/application/handlers/teams/teams-participants-filter.handler';

// @Injectable({ providedIn: 'root' })
// export class TeamsParticipantsFilterBus {
//     constructor(
//         private readonly filterHandler: TeamsParticipantsFilterHandler
//     ) {}

//     dispatch<T>(command: T): Observable<any> {
//         if (command instanceof TeamsParticipantsFilterCommand) {
//             return this.filterHandler.execute(command);
//         }

//         throw new Error('No handler found for command');
//     }
// }
