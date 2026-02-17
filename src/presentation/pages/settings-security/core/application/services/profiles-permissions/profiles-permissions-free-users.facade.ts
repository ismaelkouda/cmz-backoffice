// import { inject, Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// import { BaseFacade } from '@shared/application/base/base-facade';
// import {
//     handleObservableWithFeedback,
//     shouldFetch,
// } from '@shared/application/base/facade.utils';
// import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
// import { PAGINATION_CONST } from '@shared/constants/pagination.constants';

// import { ProfilesPermissionsFreeUsersAssignDto } from '@presentation/pages/settings-security/core/application/dtos/profiles-permissions/profiles-permissions-free-users-assign.dto';
// import { ProfilesPermissionsFreeUsersUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profiles-permissions/profiles-permissions-free-users.use-case';
// import { ProfilesPermissionsFreeUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-free-users.entity';

// @Injectable({
//     providedIn: 'root',
// })
// export class ProfilesPermissionsFreeUsersFacade extends BaseFacade<
//     ProfilesPermissionsFreeUsersEntity,
//     null
// > {
//     private readonly uiFeedbackService = inject(UiFeedbackService);
//     private readonly useCase = inject(ProfilesPermissionsFreeUsersUseCase);

//     private hasInitialized = false;
//     private lastFetchTimestamp = 0;
//     private readonly STALE_TIME = 2 * 60 * 1000;

//     private handleActionWithRefresh<T>(
//         observable: Observable<T>,
//         successKey: string
//     ): Observable<T> {
//         return handleObservableWithFeedback(
//             observable,
//             this.uiFeedbackService,
//             successKey,
//             () => this.refresh()
//         );
//     }

//     readAll(
//         filter: null,
//         page: string = PAGINATION_CONST.DEFAULT_PAGE,
//         forceRefresh = false
//     ): void {
//         const hasData = this.itemsSubject.getValue().length > 0;
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

//         this.fetchWithFilterAndPage(
//             null,
//             page,
//             this.useCase.readAll.bind(this.useCase),
//             this.uiFeedbackService
//         );

//         this.hasInitialized = true;
//         this.lastFetchTimestamp = Date.now();
//     }

//     refresh(): void {
//         const firstPage = PAGINATION_CONST.DEFAULT_PAGE;
//         this.fetchWithFilterAndPage(
//             null,
//             firstPage,
//             this.useCase.readAll.bind(this.useCase),
//             this.uiFeedbackService
//         );
//         this.lastFetchTimestamp = Date.now();
//     }

//     changePage(pageNumber: number): void {
//         this.fetchWithFilterAndPage(
//             null,
//             String(pageNumber),
//             this.useCase.readAll.bind(this.useCase),
//             this.uiFeedbackService
//         );
//         this.lastFetchTimestamp = Date.now();
//     }

//     resetMemory(): void {
//         this.hasInitialized = false;
//         this.lastFetchTimestamp = 0;
//         this.reset();
//     }

//     getMemoryStatus(): {
//         hasInitialized: boolean;
//         lastFetch: number;
//         hasData: boolean;
//     } {
//         return {
//             hasInitialized: this.hasInitialized,
//             lastFetch: this.lastFetchTimestamp,
//             hasData: this.itemsSubject.getValue() !== null,
//         };
//     }

//     assign(dto: ProfilesPermissionsFreeUsersAssignDto) {
//         return this.handleActionWithRefresh(
//             this.useCase.assign(dto),
//             'COMMON.SUCCESS.UPDATE'
//         );
//     }
// }
