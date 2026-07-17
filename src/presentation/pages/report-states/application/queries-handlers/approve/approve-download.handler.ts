import { approveDownloadQueryMapper } from '@pages/report-states/application/queries-mappers/approve/approve-download.mapper';
import { Injectable, inject } from '@angular/core';
import { ApproveDownloadQuery } from '@pages/report-states/application/queries/approve/approve-download.query';
import { ApproveUseCase } from '@pages/report-states/application/use-cases/approve/approve.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApproveDownloadHandler {
    private readonly useCase = inject(ApproveUseCase);

    execute(query: ApproveDownloadQuery): Observable<MessageResponseDto> {
        return this.useCase.download(approveDownloadQueryMapper(query));
    }
}
