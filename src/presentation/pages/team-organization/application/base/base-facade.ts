import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiError } from '@shared/domain/errors/api.error';
import { ToastrService } from 'ngx-toastr';
import {
    BehaviorSubject,
    Observable,
    catchError,
    finalize,
    tap,
    throwError,
} from 'rxjs';

export interface PaginationFilter {
    toDto(): Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export abstract class BaseFacade<TEntity, TFilter extends PaginationFilter> {
    protected readonly itemsSubject = new BehaviorSubject<TEntity[]>([]);
    protected readonly loadingSubject = new BehaviorSubject<boolean>(false);
    protected readonly filterSubject = new BehaviorSubject<TFilter | null>(
        null
    );

    readonly items$: Observable<TEntity[]> = this.itemsSubject.asObservable();
    readonly isLoading$: Observable<boolean> =
        this.loadingSubject.asObservable();
    readonly currentFilter$: Observable<TFilter | null> =
        this.filterSubject.asObservable();

    protected constructor(
        protected readonly toastService: ToastrService,
        protected readonly translateService: TranslateService
    ) {}

    protected fetchData(
        filter: TFilter,
        fetchObservable: Observable<TEntity[]>
    ): void {
        if (this.loadingSubject.getValue()) {
            return;
        }

        this.loadingSubject.next(true);
        this.filterSubject.next(filter);

        fetchObservable
            .pipe(
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

    protected getErrorMessage(error: unknown): string {
        if (error instanceof ApiError) {
            const translatedMessage = this.translateService.instant(
                error.message
            );
            if (translatedMessage === error.message) {
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

        return this.translateService.instant(
            'TEAM_ORGANIZATION.MESSAGES.ERROR.UNKNOWN_ERROR'
        );
    }

    reset(): void {
        this.itemsSubject.next([]);
        this.loadingSubject.next(false);
        this.filterSubject.next(null);
    }
}
