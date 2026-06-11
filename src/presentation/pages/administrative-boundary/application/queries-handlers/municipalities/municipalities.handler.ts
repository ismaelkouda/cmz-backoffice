import { inject, Injectable } from '@angular/core';
import { MunicipalitiesQuery } from '@pages/administrative-boundary/application/queries/municipalities/municipalities.query';
import { MunicipalitiesUseCase } from '@pages/administrative-boundary/application/use-cases/municipalities/municipalities.use-case';
import { MunicipalitiesEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesHandler {
    private readonly useCase = inject(MunicipalitiesUseCase);

    execute(
        command: MunicipalitiesQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MunicipalitiesEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                region: command.region,
                department: command.department,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page,
            options
        );
    }
}
