import { Injectable, inject } from '@angular/core';
import { EvaluateDownloadQuery } from '@pages/report-states/application/queries/evaluate/evaluate-download.query';
import { EvaluateDownloadHandler } from '@pages/report-states/application/queries-handlers/evaluate/evaluate-download.handler';
import { Observable } from 'rxjs';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class EvaluateDownloadBus {
    private readonly downloadHandler = inject(EvaluateDownloadHandler);

    dispatch<T>(query: T): Observable<SimpleResponseDto<void>> {
        if (query instanceof EvaluateDownloadQuery) {
            return this.downloadHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
