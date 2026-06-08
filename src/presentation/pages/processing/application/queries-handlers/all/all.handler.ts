import { Injectable, inject } from '@angular/core';
import { AllQuery } from '@pages/processing/application/queries/all/all.query';
import { AllUseCase } from '@pages/processing/application/use-cases/all/all.use-case';
import { AllEntity } from '@pages/processing/domain/entities/all/all.entity';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllHandler {
    private readonly useCase = inject(AllUseCase);

    execute(
        query: AllQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AllEntity>> {
        return this.useCase.execute(
            {
                initiatorPhoneNumber: query.initiatorPhoneNumber,
                uniqId: query.uniqId,
                reportType: query.reportType,
                operators: query.operators,
                source: query.source,
                state: query.state,
                startDate: query.startDate,
                endDate: query.endDate,
            },
            page,
            options
        );
    }
}
