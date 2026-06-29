import { inject, Injectable, signal } from '@angular/core';
import { EvaluateFilterDto } from '@pages/report-states/application/dto/evaluate/evaluate-filter.dto';
import { EvaluateQuery } from '@pages/report-states/application/queries/evaluate/evaluate.query';
import { EvaluateBus } from '@pages/report-states/application/queries-bus/evaluate/evaluate.bus';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { BaseFacade } from '@shared/application/services/base-facade';

import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { EvaluateDownloadBus } from '@pages/report-states/application/queries-bus/evaluate/evaluate-download.bus';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { EvaluateDownloadDto } from '@pages/report-states/application/dto/evaluate/evaluate-download.dto';
import { EvaluateDownloadQuery } from '@pages/report-states/application/queries/evaluate/evaluate-download.query';

@Injectable({ providedIn: 'root' })
export class EvaluateFacade extends BaseFacade<
    EvaluateEntity,
    EvaluateFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(EvaluateBus);
    private readonly downloadBus = inject(EvaluateDownloadBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey: string
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedback,
            successKey,
            () => this.refreshWithLastFilterAndPage()
        );
    }

    read(
        filter: EvaluateFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new EvaluateQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new EvaluateQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(null, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        const command = new EvaluateQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new EvaluateQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    resetMemory(): void {
        this.hasInitialized = false;
        this.lastFetchTimestamp = 0;
        this.reset();
    }

    getMemoryStatus(): {
        hasInitialized: boolean;
        lastFetch: number;
        hasData: boolean;
    } {
        return {
            hasInitialized: this.hasInitialized,
            lastFetch: this.lastFetchTimestamp,
            hasData: this.itemsSubject.getValue() !== null,
        };
    }

    download(download: EvaluateDownloadDto): void {
        this._actionState.set('loading');

        const query = new EvaluateDownloadQuery(
            download.format,
            download?.initiatorPhoneNumber,
            download?.uniqId,
            download?.reportType,
            download?.operators,
            download?.source,
            download?.startDate,
            download?.endDate
        );

        this.handleActionWithRefresh(
            this.downloadBus.dispatch(query),
            'COMMON.SUCCESS.DOWNLOAD'
        )
            .pipe(
                tap(() => {
                    this._actionSuccess.update((v) => v + 1);
                }),
                catchError((err) => {
                    this._actionError.set(err);
                    return throwError(() => err);
                }),
                finalize(() => this._actionState.set('idle'))
            )
            .subscribe();
    }
}
