// import { inject, Injectable } from '@angular/core';

// import { shouldFetch } from '@shared/application/services/facade.utils';
// import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
// import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

// import { MunicipalitiesFindoneFilterDto } from '@presentation/pages/administrative-boundary/core/application/dtos/municipalities/municipalities-findone-filter.dto';
// import { MunicipalitiesFindoneUseCase } from '@presentation/pages/administrative-boundary/core/application/use-cases/municipalities/municipalities-findone.use-case';
// import { MunicipalitiesFindoneEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities-findone.entity';

// @Injectable({
//     providedIn: 'root',
// })
// export class MunicipalitiesFindoneFacade extends ObjectBaseFacade<
//     MunicipalitiesFindoneEntity,
//     MunicipalitiesFindoneFilterDto
// > {
//     private readonly uiFeedbackService = inject(UiFeedbackService);
//     private readonly useCase = inject(MunicipalitiesFindoneUseCase);

//     readonly item$ = this.items$;

//     private hasInitialized = false;
//     private lastFetchTimestamp = 0;
//     private readonly STALE_TIME = 2 * 60 * 1000;

//     read(filter: MunicipalitiesFindoneFilterDto, forceRefresh = false): void {
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
