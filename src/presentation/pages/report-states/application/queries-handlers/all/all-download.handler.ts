import { allDownloadQueryMapper } from '@pages/report-states/application/queries-mappers/all/all-download.mapper';
import { Injectable, inject } from '@angular/core';
import { AllDownloadQuery } from '@pages/report-states/application/queries/all/all-download.query';
import { AllUseCase } from '@pages/report-states/application/use-cases/all/all.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllDownloadHandler {
    private readonly useCase = inject(AllUseCase);

    execute(query: AllDownloadQuery): Observable<MessageResponseDto> {
        return this.useCase.download(allDownloadQueryMapper(query));
    }
}
