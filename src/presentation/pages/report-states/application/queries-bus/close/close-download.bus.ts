import { Injectable, inject } from '@angular/core';
import { CloseDownloadQuery } from '@pages/report-states/application/queries/close/close-download.query';
import { CloseDownloadHandler } from '@pages/report-states/application/queries-handlers/close/close-download.handler';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class CloseDownloadBus {
    private readonly downloadHandler = inject(CloseDownloadHandler);

    dispatch<T>(query: T): Observable<MessageResponseDto> {
        if (query instanceof CloseDownloadQuery) {
            return this.downloadHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
