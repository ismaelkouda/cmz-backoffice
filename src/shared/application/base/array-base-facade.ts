import { Injectable } from '@angular/core';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
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

@Injectable({ providedIn: 'root' })
export abstract class ArrayBaseFacade<
    TEntity,
    TFilter,
> {
    protected readonly itemsSubject = new BehaviorSubject<TEntity[]>([]);
    protected readonly isLoadingSubject = new BehaviorSubject<boolean>(false);
    protected readonly filterSubject = new BehaviorSubject<TFilter | null>(
        null
    );

    readonly items$: Observable<TEntity[]> = this.itemsSubject.asObservable();
    readonly isLoading$: Observable<boolean> =
        this.isLoadingSubject.asObservable();
    readonly currentFilter$: Observable<TFilter | null> = this.filterSubject
        .asObservable()
        .pipe(
            distinctUntilChanged((prev, curr) => {
                if (prev === curr) return true;
                if (!prev && !curr) return true;
                if (!prev || !curr) return false;

                const prevDto: Record<string, string | string[]> = prev;
                const currDto: Record<string, string | string[]> = curr;

                const prevKeys = Object.keys(prevDto).sort();
                const currKeys = Object.keys(currDto).sort();

                if (prevKeys.length !== currKeys.length) return false;

                return prevKeys.every((key) => prevDto[key] === currDto[key]);
            })
        );

    protected fetchWithFilter(
        filter: TFilter | null,
        fetchFn: (filter: TFilter | null) => Observable<TEntity[]>,
        uiFeedback?: UiFeedbackService
    ): void {
        const fetch$ = fetchFn(filter);
        if (this.isLoadingSubject.getValue()) return;

        const prevFilter = this.filterSubject.getValue();
        if (!prevFilter || this.hasFilterChanged(prevFilter, filter)) {
            this.filterSubject.next(filter);
        }
        this.isLoadingSubject.next(true);

        fetch$.pipe(
            debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
            tap(response => {
                this.itemsSubject.next(response);
            }),
            catchError(err => {
                uiFeedback?.errorFromApi(err);
                return throwError(() => err);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        ).subscribe();
    }

    private hasFilterChanged(prevFilter: TFilter | null, newFilter: TFilter | null): boolean {
        const prevDto = (prevFilter as any).toDto?.() ?? {};
        const newDto = (newFilter as any).toDto?.() ?? {};

        const prevKeys = Object.keys(prevDto).sort();
        const newKeys = Object.keys(newDto).sort();

        if (prevKeys.length !== newKeys.length) return true;

        return !prevKeys.every(key => prevDto[key] === newDto[key]);
    }

    protected shouldFetch(forceRefresh: boolean, hasData: boolean, lastFetch: number, staleTime: number): boolean {
        if (forceRefresh) return true;
        const isStale = Date.now() - lastFetch > staleTime;
        return !hasData || isStale;
    }

    reset(): void {
        this.itemsSubject.next([]);
        this.isLoadingSubject.next(false);
        this.filterSubject.next(null);
    }
}
