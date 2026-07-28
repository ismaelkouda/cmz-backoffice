import { Injectable, inject } from '@angular/core';
import { OpticalFiberNetworkQuery } from '@pages/coverage-areas/application/queries/optical-fiber-network/optical-fiber-network.query';
import { OpticalFiberNetworkHandler } from '@pages/coverage-areas/application/queries-handlers/optical-fiber-network/optical-fiber-network.handler';
import { OpticalFiberNetworkEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkBus {
    private readonly filterHandler = inject(OpticalFiberNetworkHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<OpticalFiberNetworkEntity>> {
        if (query instanceof OpticalFiberNetworkQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
