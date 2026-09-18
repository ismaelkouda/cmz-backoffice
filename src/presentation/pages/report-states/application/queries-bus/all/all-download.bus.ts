import { Injectable, inject } from '@angular/core';
import { AllDownloadQuery } from '@pages/report-states/application/queries/all/all-download.query';
import { AllDownloadHandler } from '@pages/report-states/application/queries-handlers/all/all-download.handler';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class AllDownloadBus {
    private readonly downloadHandler = inject(AllDownloadHandler);

    dispatch<T>(query: T): Observable<MessageResponseDto> {
        if (query instanceof AllDownloadQuery) {
            return this.downloadHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
