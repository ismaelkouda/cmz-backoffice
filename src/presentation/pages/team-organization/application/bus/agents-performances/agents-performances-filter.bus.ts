// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// import { AgentsPerformancesFilterCommand } from '@presentation/pages/team-organization/application/commands/agents-performances/agents-performances-filter.command';
// import { AgentsPerformancesFilterHandler } from '@presentation/pages/team-organization/application/handlers/agents-performances/agents-performances-filter.handler';

// @Injectable({ providedIn: 'root' })
// export class AgentsPerformancesFilterBus {
//     constructor(
//         private readonly filterHandler: AgentsPerformancesFilterHandler
//     ) {}

//     dispatch<T>(command: T): Observable<any> {
//         if (command instanceof AgentsPerformancesFilterCommand) {
//             return this.filterHandler.execute(command);
//         }

//         throw new Error('No handler found for command');
//     }
// }
