import { Injectable, inject } from '@angular/core';
import { CloseDownloadQuery } from '@pages/report-states/application/queries/close/close-download.query';
import { CloseUseCase } from '@pages/report-states/application/use-cases/close/close.use-case';
import { DownloadSource } from '@presentation/pages/report-states/domain/enums/download-source.enum';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CloseDownloadHandler {
    private readonly useCase = inject(CloseUseCase);

    execute(query: CloseDownloadQuery): Observable<SimpleResponseDto<void>> {
        return this.useCase.download({
            metaData: {
                source: DownloadSource.REPORT,
            },
            format: query.format,
            initiatorPhoneNumber: query.initiatorPhoneNumber,
            uniqId: query.uniqId,
            reportType: query.reportType,
            operators: query.operators,
            source: query.source,
            startDate: query.startDate,
            endDate: query.endDate,
        });
    }
}
