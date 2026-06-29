import { Injectable, inject } from '@angular/core';
import { ApproveDownloadQuery } from '@pages/report-states/application/queries/approve/approve-download.query';
import { ApproveDownloadHandler } from '@pages/report-states/application/queries-handlers/approve/approve-download.handler';
import { Observable } from 'rxjs';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class ApproveDownloadBus {
    private readonly downloadHandler = inject(ApproveDownloadHandler);

    dispatch<T>(query: T): Observable<SimpleResponseDto<void>> {
        if (query instanceof ApproveDownloadQuery) {
            return this.downloadHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
