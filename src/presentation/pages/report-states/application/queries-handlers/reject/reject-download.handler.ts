import { rejectDownloadQueryMapper } from '@pages/report-states/application/queries-mappers/reject/reject-download.mapper';
import { Injectable, inject } from '@angular/core';
import { RejectDownloadQuery } from '@pages/report-states/application/queries/reject/reject-download.query';
import { RejectUseCase } from '@pages/report-states/application/use-cases/reject/reject.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RejectDownloadHandler {
    private readonly useCase = inject(RejectUseCase);

    execute(query: RejectDownloadQuery): Observable<MessageResponseDto> {
        return this.useCase.download(rejectDownloadQueryMapper(query));
    }
}
