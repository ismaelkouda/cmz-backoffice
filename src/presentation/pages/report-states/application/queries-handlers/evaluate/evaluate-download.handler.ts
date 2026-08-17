import { evaluateDownloadQueryMapper } from '@pages/report-states/application/queries-mappers/evaluate/evaluate-download.mapper';
import { Injectable, inject } from '@angular/core';
import { EvaluateDownloadQuery } from '@pages/report-states/application/queries/evaluate/evaluate-download.query';
import { EvaluateUseCase } from '@pages/report-states/application/use-cases/evaluate/evaluate.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EvaluateDownloadHandler {
    private readonly useCase = inject(EvaluateUseCase);

    execute(query: EvaluateDownloadQuery): Observable<MessageResponseDto> {
        return this.useCase.download(evaluateDownloadQueryMapper(query));
    }
}
