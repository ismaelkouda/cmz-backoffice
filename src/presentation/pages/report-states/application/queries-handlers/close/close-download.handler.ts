import { closeDownloadQueryMapper } from '@pages/report-states/application/queries-mappers/close/close-download.mapper';
import { Injectable, inject } from '@angular/core';
import { CloseDownloadQuery } from '@pages/report-states/application/queries/close/close-download.query';
import { CloseUseCase } from '@pages/report-states/application/use-cases/close/close.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CloseDownloadHandler {
    private readonly useCase = inject(CloseUseCase);

    execute(query: CloseDownloadQuery): Observable<MessageResponseDto> {
        return this.useCase.download(closeDownloadQueryMapper(query));
    }
}
