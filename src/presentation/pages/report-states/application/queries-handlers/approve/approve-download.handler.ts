import { Injectable, inject } from '@angular/core';
import { ApproveDownloadQuery } from '@pages/report-states/application/queries/approve/approve-download.query';
import { ApproveUseCase } from '@pages/report-states/application/use-cases/approve/approve.use-case';
import { DownloadSource } from '@presentation/pages/report-states/domain/enums/download-source.enum';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApproveDownloadHandler {
    private readonly useCase = inject(ApproveUseCase);

    execute(query: ApproveDownloadQuery): Observable<MessageResponseDto> {
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
            startDate: query.startDate,
            endDate: query.endDate,
        });
    }
}
