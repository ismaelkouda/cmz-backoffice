import { admissibleDownloadQueryMapper } from '@pages/report-states/application/queries-mappers/admissible/admissible-download.mapper';
import { Injectable, inject } from '@angular/core';
import { AdmissibleDownloadQuery } from '@pages/report-states/application/queries/admissible/admissible-download.query';
import { AdmissibleUseCase } from '@pages/report-states/application/use-cases/admissible/admissible.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdmissibleDownloadHandler {
    private readonly useCase = inject(AdmissibleUseCase);

    execute(query: AdmissibleDownloadQuery): Observable<MessageResponseDto> {
        return this.useCase.download(admissibleDownloadQueryMapper(query));
    }
}
