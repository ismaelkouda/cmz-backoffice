import { Injectable, inject } from '@angular/core';
import { ApproveDownloadQuery } from '@pages/report-states/application/queries/approve/approve-download.query';
import { ApproveDownloadHandler } from '@pages/report-states/application/queries-handlers/approve/approve-download.handler';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class ApproveDownloadBus {
    private readonly downloadHandler = inject(ApproveDownloadHandler);

    dispatch<T>(query: T): Observable<MessageResponseDto> {
        if (query instanceof ApproveDownloadQuery) {
            return this.downloadHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
