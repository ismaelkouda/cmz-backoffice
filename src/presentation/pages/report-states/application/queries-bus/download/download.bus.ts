import { Injectable, inject } from '@angular/core';
import { DownloadQuery } from '@pages/report-states/application/queries/download/download.query';
import { DownloadHandler } from '@pages/report-states/application/queries-handlers/download/download.handler';
import { DownloadEntity } from '@pages/report-states/domain/entities/download/download.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DownloadBus {
    private readonly filterHandler = inject(DownloadHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DownloadEntity>> {
        if (query instanceof DownloadQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
