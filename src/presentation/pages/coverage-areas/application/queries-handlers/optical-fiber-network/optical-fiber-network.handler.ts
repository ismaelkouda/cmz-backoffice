import { Injectable, inject } from '@angular/core';
import { opticalFiberNetworkQueryMapper } from '@pages/coverage-areas/application/queries-mappers/optical-fiber-network/optical-fiber-network.mapper';
import { OpticalFiberNetworkQuery } from '@pages/coverage-areas/application/queries/optical-fiber-network/optical-fiber-network.query';
import { OpticalFiberNetworkUseCase } from '@pages/coverage-areas/application/use-cases/optical-fiber-network/optical-fiber-network.use-case';
import { OpticalFiberNetworkEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkHandler {
    private readonly useCase = inject(OpticalFiberNetworkUseCase);

    execute(
        command: OpticalFiberNetworkQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<OpticalFiberNetworkEntity>> {
        return this.useCase.execute(
            opticalFiberNetworkQueryMapper(command),
            page,
            options
        );
    }
}
