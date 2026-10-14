import { Injectable, inject } from '@angular/core';
import { RequestDownloadQuery } from '@pages/report-states/application/queries/request/request-download.query';
import { RequestDownloadHandler } from '@pages/report-states/application/queries-handlers/request/request-download.handler';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class RequestDownloadBus {
    private readonly downloadHandler = inject(RequestDownloadHandler);

    dispatch<T>(query: T): Observable<MessageResponseDto> {
        if (query instanceof RequestDownloadQuery) {
            return this.downloadHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
