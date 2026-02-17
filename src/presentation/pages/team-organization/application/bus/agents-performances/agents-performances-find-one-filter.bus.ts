// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// import { AgentsPerformancesFindOneFilterCommand } from '@presentation/pages/team-organization/application/commands/agents-performances/agents-performances-find-one-filter.command';
// import { AgentsPerformancesFindOneFilterHandler } from '@presentation/pages/team-organization/application/handlers/agents-performances/agents-performances-find-one-filter.handler';

// @Injectable({ providedIn: 'root' })
// export class AgentsPerformancesFindOneFilterBus {
//     constructor(
//         private readonly filterHandler: AgentsPerformancesFindOneFilterHandler
//     ) {}

//     dispatch<T>(command: T): Observable<any> {
//         if (command instanceof AgentsPerformancesFindOneFilterCommand) {
//             return this.filterHandler.execute(command);
//         }

//         throw new Error('No handler found for command');
//     }
// }
