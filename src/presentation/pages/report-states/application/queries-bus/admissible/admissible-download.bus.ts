import { Injectable, inject } from '@angular/core';
import { AdmissibleDownloadQuery } from '@pages/report-states/application/queries/admissible/admissible-download.query';
import { AdmissibleDownloadHandler } from '@pages/report-states/application/queries-handlers/admissible/admissible-download.handler';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class AdmissibleDownloadBus {
    private readonly downloadHandler = inject(AdmissibleDownloadHandler);

    dispatch<T>(query: T): Observable<MessageResponseDto> {
        if (query instanceof AdmissibleDownloadQuery) {
            return this.downloadHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
