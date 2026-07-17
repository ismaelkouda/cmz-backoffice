import { regionsFindOneQueryMapper } from '@pages/administrative-boundary/application/queries-mappers/regions/regions-find-one.mapper';
import { inject, Injectable } from '@angular/core';
import { RegionsFindOneQuery } from '@pages/administrative-boundary/application/queries/regions/regions-find-one.query';
import { RegionsFindOneUseCase } from '@pages/administrative-boundary/application/use-cases/regions/regions-find-one.use-case';
import { RegionsFindOneEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegionsFindOneHandler {
    private readonly useCase = inject(RegionsFindOneUseCase);

    execute(
        command: RegionsFindOneQuery,
        options?: FetchOptions
    ): Observable<RegionsFindOneEntity> {
        return this.useCase.execute(
            regionsFindOneQueryMapper(command),
            options
        );
    }
}
