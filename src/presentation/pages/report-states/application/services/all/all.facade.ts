import { inject, Injectable, signal } from '@angular/core';
import { AllFilterDto } from '@pages/report-states/application/dto/all/all-filter.dto';
import { AllQuery } from '@pages/report-states/application/queries/all/all.query';
import { AllBus } from '@pages/report-states/application/queries-bus/all/all.bus';
import { AllEntity } from '@pages/report-states/domain/entities/all/all.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { StatsDto as AllStatsDto } from '@pages/report-states/infrastructure/api/dto/all/all-response-api.dto';

import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { AllDownloadBus } from '@pages/report-states/application/queries-bus/all/all-download.bus';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { AllDownloadDto } from '@pages/report-states/application/dto/all/all-download.dto';
import { AllDownloadQuery } from '@pages/report-states/application/queries/all/all-download.query';
import { DownloadFacade } from '@pages/report-states/application/services/download/download.facade';

@Injectable({ providedIn: 'root' })
export class AllFacade extends BaseFacade<
    AllEntity,
    AllFilterDto,
    AllStatsDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(AllBus);
    private readonly downloadBus = inject(AllDownloadBus);
    private readonly downloadFacade = inject(DownloadFacade);

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
            () => {
                this.refreshWithLastFilterAndPage();
                this.downloadFacade.refreshWithLastFilterAndPage();
            }
        );
    }

    read(
        filter: AllFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new AllQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.requestReportUniqId,
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
        const command = new AllQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.requestReportUniqId,
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
        const command = new AllQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.requestReportUniqId,
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
        const command = new AllQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.requestReportUniqId,
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

    download(download: AllDownloadDto): void {
        this._actionState.set('loading');

        const query = new AllDownloadQuery(
            download.format,
            download?.initiatorPhoneNumber,
            download?.uniqId,
            download?.requestReportUniqId,
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
