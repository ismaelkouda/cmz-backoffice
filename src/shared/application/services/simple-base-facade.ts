// import { computed, inject, Injectable, signal } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
// import { ApiError } from '@shared/domain/errors/api.error';
// import { ResourceState } from '@shared/domain/interfaces/resource-state.type';
// import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
// import { ToastrService } from 'ngx-toastr';
// import {
//     BehaviorSubject,
//     catchError,
//     debounceTime,
//     distinctUntilChanged,
//     finalize,
//     Observable,
//     tap,
//     throwError,
// } from 'rxjs';

// export interface Filter {
//     toDto(): Record<string, string | string[] | undefined>;
// }

// export abstract class SimpleBaseFacade<TEntity, TFilter> {
//     protected readonly _state = signal<ResourceState<TEntity, TFilter>>({
//         filter: null,
//         data: null,
//         loading: false,
//         error: null,
//         lastFetch: 0,
//     });

//     readonly state = this._state.asReadonly();

//     readonly filter = computed(() => this._state().filter);
//     readonly items = computed(() => this._state().data);
//     readonly loading = computed(() => this._state().loading);
//     readonly error = computed(() => this._state().error);

//     readonly items$: Observable<TEntity> = this.itemsSubject.asObservable();
//     readonly isLoading$: Observable<boolean> =
//         this.loadingSubject.asObservable();
//     readonly currentFilter$: Observable<TFilter | null> = this.filterSubject
//         .asObservable()
//         .pipe(
//             distinctUntilChanged((prev, curr) => {
//                 if (prev === curr) {
//                     return true;
//                 }
//                 if (!prev && !curr) {
//                     return true;
//                 }
//                 if (!prev || !curr) {
//                     return false;
//                 }

//                 const prevDto = prev.toDto();
//                 const currDto = curr.toDto();

//                 const prevKeys = Object.keys(prevDto).sort();
//                 const currKeys = Object.keys(currDto).sort();

//                 if (prevKeys.length !== currKeys.length) {
//                     return false;
//                 }

//                 return prevKeys.every((key) => prevDto[key] === currDto[key]);
//             })
//         );

//     protected fetch(
//         filter: TFilter,
//         fetch$: Observable<TEntity>,
//         ui?: UiFeedbackService,
//         staleTime = 0,
//         force = false,
//         skipSameFilter = false
//     ): void {
//         const current = this._state();

//         if (!force && !this.shouldFetch(current, staleTime)) {
//             return;
//         }

//         if (current.loading) {
//             return;
//         }

//         if (!filter) {
//             this.filterSubject.next(null);
//         }

//         const currentFilter = this.filterSubject.getValue();
//         const filterChanged =
//             !currentFilter || this.hasFilterChanged(currentFilter, filter);

//         this.loadingSubject.next(true);

//         if (filterChanged) {
//             this.filterSubject.next(filter);
//         }

//         fetchObservable
//             .pipe(
//                 debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
//                 tap((response) => {
//                     this.itemsSubject.next(response);
//                 }),
//                 finalize(() => this.loadingSubject.next(false)),
//                 catchError((error: unknown) => {
//                     const errorMessage = this.getErrorMessage(error);
//                     this.toastService.error(errorMessage);
//                     return throwError(() => error);
//                 })
//             )
//             .subscribe();
//     }

//     protected changePageInternal(fetchObservable: Observable<TEntity>): void {
//         const currentFilter = this.filterSubject.getValue();
//         if (currentFilter) {
//             this.fetchData(currentFilter, fetchObservable);
//         }
//     }

//     protected getErrorMessage(error: any): string {
//         if (error instanceof ApiError) {
//             const translatedMessage = this.translateService.instant(error.code);
//             if (translatedMessage === error.code) {
//                 return error.message;
//             }
//             return translatedMessage;
//         }

//         if (error instanceof Error) {
//             const translatedMessage = this.translateService.instant(
//                 error.message
//             );
//             if (translatedMessage === error.message) {
//                 return error.message;
//             }
//             return translatedMessage;
//         }

//         return this.translateService.instant(error['message']);
//     }

//     private hasFilterChanged(
//         prevFilter: TFilter,
//         newFilter: TFilter | null
//     ): boolean {
//         const prevDto = (prevFilter as PaginationFilter).toDto();
//         const newDto = (newFilter as PaginationFilter).toDto();

//         const prevKeys = Object.keys(prevDto).sort();
//         const newKeys = Object.keys(newDto).sort();

//         if (prevKeys.length !== newKeys.length) {
//             return true;
//         }

//         return !prevKeys.every((key) => prevDto[key] === newDto[key]);
//     }

//     reset(): void {
//         this.itemsSubject.next({} as TEntity);
//         this.loadingSubject.next(false);
//         this.filterSubject.next(null);
//     }
// }
