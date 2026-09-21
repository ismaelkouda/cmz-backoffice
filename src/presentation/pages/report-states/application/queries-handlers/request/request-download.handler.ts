import { requestDownloadQueryMapper } from '@pages/report-states/application/queries-mappers/request/request-download.mapper';
import { Injectable, inject } from '@angular/core';
import { RequestDownloadQuery } from '@pages/report-states/application/queries/request/request-download.query';
import { RequestUseCase } from '@pages/report-states/application/use-cases/request/request.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestDownloadHandler {
    private readonly useCase = inject(RequestUseCase);

    execute(query: RequestDownloadQuery): Observable<MessageResponseDto> {
        return this.useCase.download(requestDownloadQueryMapper(query));
    }
}
