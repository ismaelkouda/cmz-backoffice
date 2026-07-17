import { downloadQueryMapper } from '@pages/report-states/application/queries-mappers/download/download.mapper';
import { Injectable, inject } from '@angular/core';
import { DownloadQuery } from '@pages/report-states/application/queries/download/download.query';
import { DownloadUseCase } from '@pages/report-states/application/use-cases/download/download.use-case';
import { DownloadEntity } from '@pages/report-states/domain/entities/download/download.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DownloadHandler {
    private readonly useCase = inject(DownloadUseCase);

    execute(
        query: DownloadQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DownloadEntity>> {
        return this.useCase.execute(downloadQueryMapper(query), page, options);
    }
}
