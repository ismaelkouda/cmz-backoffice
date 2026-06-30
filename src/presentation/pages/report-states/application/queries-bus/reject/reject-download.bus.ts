import { Injectable, inject } from '@angular/core';
import { RejectDownloadQuery } from '@pages/report-states/application/queries/reject/reject-download.query';
import { RejectDownloadHandler } from '@pages/report-states/application/queries-handlers/reject/reject-download.handler';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class RejectDownloadBus {
    private readonly downloadHandler = inject(RejectDownloadHandler);

    dispatch<T>(query: T): Observable<MessageResponseDto> {
        if (query instanceof RejectDownloadQuery) {
            return this.downloadHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
