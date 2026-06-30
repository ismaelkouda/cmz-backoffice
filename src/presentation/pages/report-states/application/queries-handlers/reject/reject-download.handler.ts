import { Injectable, inject } from '@angular/core';
import { RejectDownloadQuery } from '@pages/report-states/application/queries/reject/reject-download.query';
import { RejectUseCase } from '@pages/report-states/application/use-cases/reject/reject.use-case';
import { DownloadSource } from '@presentation/pages/report-states/domain/enums/download-source.enum';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RejectDownloadHandler {
    private readonly useCase = inject(RejectUseCase);

    execute(query: RejectDownloadQuery): Observable<MessageResponseDto> {
        return this.useCase.download({
            metaData: {
                source: DownloadSource.REQUEST,
            },
            format: query.format,
            initiatorPhoneNumber: query.initiatorPhoneNumber,
            uniqId: query.uniqId,
            reportType: query.reportType,
            operators: query.operators,
            source: query.source,
            status: query.status,
            startDate: query.startDate,
            endDate: query.endDate,
        });
    }
}
