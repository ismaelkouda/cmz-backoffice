// import { DatePeriod } from '@shared/core/domain/value-object/date-period.vo';

// import { AgentsPerformancesFindOneFilterVo } from '@presentation/pages/team-organization/domain/value-objects/agents-performances-find-one/agents-performances-find-one-filter.vo';

// export class AgentsPerformancesFindOneFilterEntity {
//     constructor(
//         public readonly search?: string,
//         public readonly period?: DatePeriod
//     ) {}

//     static fromVo(
//         vo: AgentsPerformancesFindOneFilterVo
//     ): AgentsPerformancesFindOneFilterEntity {
//         return new AgentsPerformancesFindOneFilterEntity(vo.search, vo.period);
//     }

//     isRestrictedByPeriod(): boolean {
//         return !!this.period;
//     }

//     isToday(): boolean {
//         if (!this.period) {
//             return false;
//         }
//         const today = new Date();
//         return (
//             this.period.start.toDateString() === today.toDateString() &&
//             this.period.end.toDateString() === today.toDateString()
//         );
//     }

//     describe(): string {
//         return JSON.stringify({
//             search: this.search,
//             period: this.period
//                 ? {
//                       start: this.period.start.toISOString(),
//                       end: this.period.end.toISOString(),
//                   }
//                 : null,
//         });
//     }
// }
