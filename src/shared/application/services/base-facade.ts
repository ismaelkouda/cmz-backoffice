import { Injectable } from '@angular/core';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
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
    toDto(): Record<string, string | string[]>;
}

@Injectable({ providedIn: 'root' })
export abstract class BaseFacade<TEntity, TFilter, TStats = never> {
    protected readonly itemsSubject = new BehaviorSubject<TEntity[]>([]);
    protected readonly paginationSubject = new BehaviorSubject<
        Paginate<TEntity, TStats>
    >({} as Paginate<TEntity, TStats>);
    protected readonly isLoadingSubject = new BehaviorSubject<boolean>(false);
    protected readonly filterSubject = new BehaviorSubject<TFilter | null>(
        null
    );
    protected readonly pageSubject = new BehaviorSubject<string>(
        PAGINATION_CONST.DEFAULT_PAGE
    );
    protected readonly statsSubject = new BehaviorSubject<TStats | null>(null);

    readonly items$: Observable<TEntity[]> = this.itemsSubject.asObservable();
    readonly pagination$: Observable<Paginate<TEntity, TStats>> =
        this.paginationSubject.asObservable();
    readonly isLoading$: Observable<boolean> =
        this.isLoadingSubject.asObservable();
    readonly currentFilter$: Observable<TFilter | null> = this.filterSubject
        .asObservable()
        .pipe(
            distinctUntilChanged((prev, curr) => {
                if (prev === curr) {
                    return true;
                }
                if (!prev && !curr) {
                    return true;
                }
                if (!prev || !curr) {
                    return false;
                }

                const prevDto: Record<string, string | string[]> = prev;
                const currDto: Record<string, string | string[]> = curr;

                const prevKeys = Object.keys(prevDto).sort();
                const currKeys = Object.keys(currDto).sort();

                if (prevKeys.length !== currKeys.length) {
                    return false;
                }

                return prevKeys.every((key) => prevDto[key] === currDto[key]);
            })
        );
    readonly currentPage$: Observable<string> = this.pageSubject.asObservable();
    readonly stats$ = this.statsSubject.asObservable();

    protected fetchWithFilterAndPage(
        filter: TFilter | null,
        page: string,
        fetch$: Observable<Paginate<TEntity, TStats>>,
        uiFeedback?: UiFeedbackService
    ): void {
        if (this.isLoadingSubject.getValue()) {
            return;
        }

        const prevFilter = this.filterSubject.getValue();
        if (!prevFilter || this.hasFilterChanged(prevFilter, filter)) {
            this.filterSubject.next(filter);
        }
        this.pageSubject.next(page);
        this.isLoadingSubject.next(true);

        fetch$
            .pipe(
                debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
                tap((response) => {
                    this.itemsSubject.next(response.data);
                    this.paginationSubject.next(response);
                    console.log('response.stats', response.stats);
                    this.statsSubject.next(response.stats ?? null);
                }),
                catchError((err) => {
                    uiFeedback?.notifyError(err);
                    return throwError(() => err);
                }),
                finalize(() => this.isLoadingSubject.next(false))
            )
            .subscribe();
    }

    private hasFilterChanged(
        prevFilter: TFilter | null,
        newFilter: TFilter | null
    ): boolean {
        const prevDto = prevFilter as Record<string, string | string[]>;
        const newDto = newFilter as Record<string, string | string[]>;

        const prevKeys = Object.keys(prevDto).sort();
        const newKeys = Object.keys(newDto).sort();

        if (prevKeys.length !== newKeys.length) {
            return true;
        }

        return !prevKeys.every((key) => prevDto[key] === newDto[key]);
    }

    reset(): void {
        this.itemsSubject.next([]);
        this.paginationSubject.next({} as Paginate<TEntity, TStats>);
        this.isLoadingSubject.next(false);
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        this.statsSubject.next(null);
    }
}
