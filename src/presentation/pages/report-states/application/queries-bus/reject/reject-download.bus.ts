import { Injectable, inject } from '@angular/core';
import { RejectDownloadQuery } from '@pages/report-states/application/queries/reject/reject-download.query';
import { RejectDownloadHandler } from '@pages/report-states/application/queries-handlers/reject/reject-download.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RejectDownloadBus {
    private readonly downloadHandler = inject(RejectDownloadHandler);

    dispatch<T>(query: T): Observable<SimpleResponseDto<void>> {
        if (query instanceof RejectDownloadQuery) {
            return this.downloadHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
