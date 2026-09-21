import { inject, Injectable } from '@angular/core';
import { RequestFilterDto } from '@pages/report-states/application/dto/request/request-filter.dto';
import { RequestQuery } from '@pages/report-states/application/queries/request/request.query';
import { RequestBus } from '@pages/report-states/application/queries-bus/request/request.bus';
import { RequestEntity } from '@pages/report-states/domain/entities/request/request.entity';
import { BaseFacade } from '@shared/application/services/base-facade';

import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { Observable } from 'rxjs';
import { RequestDownloadBus } from '@pages/report-states/application/queries-bus/request/request-download.bus';
import { RequestDownloadDto } from '@pages/report-states/application/dto/request/request-download.dto';
import { RequestDownloadQuery } from '@pages/report-states/application/queries/request/request-download.query';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { DownloadFacade } from '@pages/report-states/application/services/download/download.facade';

@Injectable({ providedIn: 'root' })
export class RequestFacade extends BaseFacade<RequestEntity, RequestFilterDto> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(RequestBus);
    private readonly downloadBus = inject(RequestDownloadBus);
    private readonly downloadFacade = inject(DownloadFacade);

    private reportUniqId = '';

    private scopedFilter(filter: RequestFilterDto | null): RequestFilterDto {
        return {
            ...(filter ?? {}),
            requestReportUniqId:
                filter?.requestReportUniqId || this.reportUniqId || undefined,
        };
    }

    private buildQuery(filter: RequestFilterDto | null): RequestQuery {
        return new RequestQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.requestReportUniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.startDate,
            filter?.endDate
        );
    }

    read(
        filter: RequestFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        if (filter.requestReportUniqId) {
            this.reportUniqId = filter.requestReportUniqId;
        }
        const merged = this.scopedFilter(filter);
        const query = this.buildQuery(merged);
        const fetch$ = this.filterBus.dispatch(query, page, options);
        this.fetchWithFilterAndPage(merged, page, fetch$, this.uiFeedback);
    }

    refresh(): void {
        const merged = this.scopedFilter(this.filterSubject.getValue());
        const query = this.buildQuery(merged);
        const page = PAGINATION_CONST.DEFAULT_PAGE;
        const fetch$ = this.filterBus.dispatch(query, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(merged, page, fetch$, this.uiFeedback);
    }

    changePage(page: string): void {
        const merged = this.scopedFilter(this.filterSubject.getValue());
        const query = this.buildQuery(merged);
        const fetch$ = this.filterBus.dispatch(query, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(merged, page, fetch$, this.uiFeedback);
    }

    refreshWithLastFilterAndPage(): void {
        const merged = this.scopedFilter(this.filterSubject.getValue());
        const page = this.pageSubject.getValue();
        const query = this.buildQuery(merged);
        const fetch$ = this.filterBus.dispatch(query, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(merged, page, fetch$, this.uiFeedback);
    }

    download(download: RequestDownloadDto): void {
        const dto: RequestDownloadDto = {
            ...download,
            requestReportUniqId:
                download.requestReportUniqId || this.reportUniqId || undefined,
        };

        const query = new RequestDownloadQuery(
            dto.format,
            dto?.initiatorPhoneNumber,
            dto?.uniqId,
            dto?.requestReportUniqId,
            dto?.reportType,
            dto?.operators,
            dto?.source,
            dto?.startDate,
            dto?.endDate
        );

        this.handleDownloadWithRefresh(
            this.downloadBus.dispatch(query),
            'COMMON.SUCCESS.DOWNLOAD'
        ).subscribe();
    }

    private handleDownloadWithRefresh<T>(
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
}
