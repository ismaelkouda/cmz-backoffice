import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ApiError } from '@shared/domain/errors/api.error';
import { ToastrService } from 'ngx-toastr';
import {
    BehaviorSubject,
    Observable,
    catchError,
    debounceTime,
    distinctUntilChanged,
    finalize,
    tap,
    throwError,
} from 'rxjs';

export interface PaginationFilter {
    toDto(): Record<string, string | string[] | void>;
}

@Injectable({ providedIn: 'root' })
export abstract class SimpleBaseFacade<
    TEntity,
    TFilter extends PaginationFilter | void = void,
> {
    protected readonly itemsSubject = new BehaviorSubject<TEntity>(
        {} as TEntity
    );
    protected readonly loadingSubject = new BehaviorSubject<boolean>(false);
    protected readonly filterSubject = new BehaviorSubject<TFilter | null>(
        null
    );

    readonly items$: Observable<TEntity> = this.itemsSubject.asObservable();
    readonly isLoading$: Observable<boolean> =
        this.loadingSubject.asObservable();
    readonly currentFilter$: Observable<TFilter | null> = this.filterSubject
        .asObservable()
        .pipe(
            distinctUntilChanged((prev, curr) => {
                if (prev === curr) return true;
                if (!prev && !curr) return true;
                if (!prev || !curr) return false;

                const prevDto = prev.toDto();
                const currDto = curr.toDto();

                const prevKeys = Object.keys(prevDto).sort();
                const currKeys = Object.keys(currDto).sort();

                if (prevKeys.length !== currKeys.length) return false;

                return prevKeys.every((key) => prevDto[key] === currDto[key]);
            })
        );

    protected constructor(
        protected readonly toastService: ToastrService,
        protected readonly translateService: TranslateService
    ) {}

    protected fetchData(
        filter: TFilter | null = null,
        fetchObservable: Observable<TEntity>
    ): void {
        if (this.loadingSubject.getValue()) {
            return;
        }

        if (!filter) {
            this.filterSubject.next(null);
        }

        const currentFilter = this.filterSubject.getValue();
        const filterChanged =
            !currentFilter || this.hasFilterChanged(currentFilter, filter);

        this.loadingSubject.next(true);

        if (filterChanged) {
            this.filterSubject.next(filter);
        }

        fetchObservable
            .pipe(
                debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
                tap((response) => {
                    this.itemsSubject.next(response);
                }),
                finalize(() => this.loadingSubject.next(false)),
                catchError((error: unknown) => {
                    const errorMessage = this.getErrorMessage(error);
                    this.toastService.error(errorMessage);
                    return throwError(() => error);
                })
            )
            .subscribe();
    }

    protected changePageInternal(fetchObservable: Observable<TEntity>): void {
        const currentFilter = this.filterSubject.getValue();
        if (currentFilter) {
            this.fetchData(currentFilter, fetchObservable);
        }
    }

    protected getErrorMessage(error: any): string {
        if (error instanceof ApiError) {
            const translatedMessage = this.translateService.instant(error.code);
            if (translatedMessage === error.code) {
                return error.message;
            }
            return translatedMessage;
        }

        if (error instanceof Error) {
            const translatedMessage = this.translateService.instant(
                error.message
            );
            if (translatedMessage === error.message) {
                return error.message;
            }
            return translatedMessage;
        }

        return this.translateService.instant(error['message']);
    }

    private hasFilterChanged(
        prevFilter: TFilter,
        newFilter: TFilter | null
    ): boolean {
        const prevDto = (prevFilter as PaginationFilter).toDto();
        const newDto = (newFilter as PaginationFilter).toDto();

        const prevKeys = Object.keys(prevDto).sort();
        const newKeys = Object.keys(newDto).sort();

        if (prevKeys.length !== newKeys.length) {
            return true;
        }

        return !prevKeys.every((key) => prevDto[key] === newDto[key]);
    }

    reset(): void {
        this.itemsSubject.next({} as TEntity);
        this.loadingSubject.next(false);
        this.filterSubject.next(null);
    }

    protected readonly itemsDetailsSubject = new BehaviorSubject<TEntity>(
        {} as TEntity
    );
    protected readonly loadingDetailsSubject = new BehaviorSubject<boolean>(
        false
    );
    protected readonly endPointTypeDetailsSubject =
        new BehaviorSubject<EndPointType>('requests');

    readonly itemsDetails$: Observable<TEntity> =
        this.itemsDetailsSubject.asObservable();
    readonly loadingDetails$: Observable<boolean> =
        this.loadingDetailsSubject.asObservable();
    readonly endPointType$: Observable<EndPointType> =
        this.endPointTypeDetailsSubject.asObservable();

    protected fetchDataDetails(
        fetchObservable: Observable<TEntity>,
        endPointType: EndPointType
    ): void {
        if (this.loadingDetailsSubject.getValue()) {
            return;
        }

        this.loadingDetailsSubject.next(true);
        this.endPointTypeDetailsSubject.next(endPointType);

        fetchObservable
            .pipe(
                debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
                tap((response) => {
                    this.itemsDetailsSubject.next(response);
                }),
                finalize(() => this.loadingDetailsSubject.next(false)),
                catchError((error: unknown) => {
                    const errorMessage = this.getErrorMessage(error);
                    this.toastService.error(errorMessage);
                    return throwError(() => error);
                })
            )
            .subscribe();
    }

    resetDetails(): void {
        this.itemsDetailsSubject.next({} as TEntity);
        this.loadingDetailsSubject.next(false);
    }

    protected readonly loadingTreatmentSubject = new BehaviorSubject<boolean>(
        false
    );
}
