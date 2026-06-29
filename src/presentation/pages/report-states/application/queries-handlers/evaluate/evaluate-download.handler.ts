import { Injectable, inject } from '@angular/core';
import { EvaluateDownloadQuery } from '@pages/report-states/application/queries/evaluate/evaluate-download.query';
import { EvaluateUseCase } from '@pages/report-states/application/use-cases/evaluate/evaluate.use-case';
import { DownloadSource } from '@presentation/pages/report-states/domain/enums/download-source.enum';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EvaluateDownloadHandler {
    private readonly useCase = inject(EvaluateUseCase);

    execute(query: EvaluateDownloadQuery): Observable<SimpleResponseDto<void>> {
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
