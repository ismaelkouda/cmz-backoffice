import { municipalitiesFindOneQueryMapper } from '@pages/administrative-boundary/application/queries-mappers/municipalities/municipalities-find-one.mapper';
import { inject, Injectable } from '@angular/core';
import { MunicipalitiesFindOneQuery } from '@pages/administrative-boundary/application/queries/municipalities/municipalities-find-one.query';
import { MunicipalitiesFindOneUseCase } from '@pages/administrative-boundary/application/use-cases/municipalities/municipalities-find-one.use-case';
import { MunicipalitiesFindOneEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesFindOneHandler {
    private readonly useCase = inject(MunicipalitiesFindOneUseCase);

    execute(
        command: MunicipalitiesFindOneQuery,
        options?: FetchOptions
    ): Observable<MunicipalitiesFindOneEntity> {
        return this.useCase.execute(
            municipalitiesFindOneQueryMapper(command),
            options
        );
    }
}
