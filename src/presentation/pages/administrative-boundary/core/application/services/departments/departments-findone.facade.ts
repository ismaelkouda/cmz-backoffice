// import { inject, Injectable } from '@angular/core';

// import { shouldFetch } from '@shared/application/services/facade.utils';
// import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
// import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

// import { DepartmentsFindoneFilterDto } from '@presentation/pages/administrative-boundary/core/application/dtos/departments/departments-findone-filter.dto';
// import { DepartmentsFindoneUseCase } from '@presentation/pages/administrative-boundary/core/application/use-cases/departments/departments-findone.use-case';
// import { DepartmentsFindoneEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/departments/departments-findone.entity';

// @Injectable({ providedIn: 'root' })
// export class DepartmentsFindoneFacade extends ObjectBaseFacade<
//     DepartmentsFindoneEntity,
//     DepartmentsFindoneFilterDto
// > {
//     private readonly uiFeedbackService = inject(UiFeedbackService);
//     private readonly useCase = inject(DepartmentsFindoneUseCase);

//     readonly item$ = this.items$;

//     private hasInitialized = false;
//     private lastFetchTimestamp = 0;
//     private readonly STALE_TIME = 2 * 60 * 1000;

//     read(filter: DepartmentsFindoneFilterDto, forceRefresh = false): void {
//         const hasData = this.itemsSubject.getValue() !== null;
//         if (
//             !shouldFetch(
//                 forceRefresh,
//                 hasData,
//                 this.lastFetchTimestamp,
//                 this.STALE_TIME
//             )
//         ) {
//             return;
//         }
//         this.fetchWithFilter(
//             filter,
//             this.useCase.read.bind(this.useCase),
//             this.uiFeedbackService
//         );
//         this.hasInitialized = true;
//         this.lastFetchTimestamp = Date.now();
//     }
// }
