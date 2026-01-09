import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UiFeedbackService } from '../ui/ui-feedback.service';

export interface FetchOptions<TEntity, TFilter> {
    itemsSubject: BehaviorSubject<TEntity[]>;
    paginationSubject: BehaviorSubject<Paginate<TEntity>>;
    loadingSubject: BehaviorSubject<boolean>;
    pageSubject: BehaviorSubject<string>;
    filterSubject?: BehaviorSubject<TFilter | null>;
    filter?: TFilter;
    page?: string;
    uiFeedback?: UiFeedbackService;
}

/* export function fetchWithFilterAndPage<TEntity, TFilter>(
    fetchObservable: Observable<Paginate<TEntity>>,
    options: FetchOptions<TEntity, TFilter>
): void {
    const {
        itemsSubject,
        paginationSubject,
        loadingSubject,
        pageSubject,
        filterSubject,
        filter,
        page,
        uiFeedback
    } = options;

    if (loadingSubject.getValue()) return;

    if (filterSubject && filter) {
        const prevFilter = filterSubject.getValue();
        if (!prevFilter || hasFilterChanged(prevFilter, filter)) {
            filterSubject.next(filter);
        }
    }

    if (page) pageSubject.next(page);

    loadingSubject.next(true);

    fetchObservable.pipe(
        debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
        tap(response => {
            itemsSubject.next(response.data);
            paginationSubject.next(response);
        }),
        catchError(err => {
            uiFeedback?.errorFromApi(err);
            return throwError(() => err);
        }),
        finalize(() => loadingSubject.next(false))
    ).subscribe();
}

export function hasFilterChanged<TFilter>(prevFilter: TFilter, newFilter: TFilter): boolean {
    const prevDto = (prevFilter as any).toDto?.() ?? {};
    const newDto = (newFilter as any).toDto?.() ?? {};

    const prevKeys = Object.keys(prevDto).sort();
    const newKeys = Object.keys(newDto).sort();

    if (prevKeys.length !== newKeys.length) return true;

    return !prevKeys.every(key => prevDto[key] === newDto[key]);
} */


export function handleObservableWithFeedback<T>(
    obs: Observable<T>,
    uiFeedback: UiFeedbackService,
    successKey?: string,
    refresh?: () => void
): Observable<T> {
    return obs.pipe(
        tap(() => {
            if (successKey) uiFeedback.success(successKey);
            if (refresh) refresh();
        }),
        catchError(error => {
            uiFeedback.errorFromApi(error);
            return throwError(() => error);
        })
    );
}

export function shouldFetch(
    forceRefresh: boolean,
    hasData: boolean,
    lastFetch: number,
    staleTime: number
): boolean {
    if (forceRefresh) return true;
    const isStale = Date.now() - lastFetch > staleTime;
    return !hasData || isStale;
}
