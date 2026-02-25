import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AllQuery } from '@presentation/pages/requests/application/queries/all/all.query';
import { AllUseCase } from '@presentation/pages/requests/application/use-cases/all/all.use-case';
import { AllEntity } from '@presentation/pages/requests/domain/entities/all/all.entity';

@Injectable({ providedIn: 'root' })
export class AllHandler {
    constructor(private readonly useCase: AllUseCase) {}

    execute(query: AllQuery, page: string): Observable<Paginate<AllEntity>> {
        return this.useCase.execute(
            {
                initiatorPhoneNumber: query.initiatorPhoneNumber,
                uniqId: query.uniqId,
                reportType: query.reportType,
                operators: query.operators,
                source: query.source,
                status: query.status,
                startDate: query.startDate,
                endDate: query.endDate,
            },
            page
        );
    }
}
