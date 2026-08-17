import { Injectable, inject } from '@angular/core';
import { opticalFiberNetworkFindOneQueryMapper } from '@pages/coverage-areas/application/queries-mappers/optical-fiber-network/optical-fiber-network-find-one.mapper';
import { OpticalFiberNetworkFindOneQuery } from '@pages/coverage-areas/application/queries/optical-fiber-network/optical-fiber-network-find-one.query';
import { OpticalFiberNetworkFindOneUseCase } from '@pages/coverage-areas/application/use-cases/optical-fiber-network/optical-fiber-network-find-one.use-case';
import { OpticalFiberNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkFindOneHandler {
    private readonly useCase = inject(OpticalFiberNetworkFindOneUseCase);

    execute(
        command: OpticalFiberNetworkFindOneQuery,
        options?: FetchOptions
    ): Observable<OpticalFiberNetworkFindOneEntity> {
        return this.useCase.execute(
            opticalFiberNetworkFindOneQueryMapper(command),
            options
        );
    }
}
