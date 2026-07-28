import { Injectable, inject } from '@angular/core';
import { OpticalFiberNetworkFindOneQuery } from '@pages/coverage-areas/application/queries/optical-fiber-network/optical-fiber-network-find-one.query';
import { OpticalFiberNetworkFindOneHandler } from '@pages/coverage-areas/application/queries-handlers/optical-fiber-network/optical-fiber-network-find-one.handler';
import { OpticalFiberNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkFindOneBus {
    private readonly handler = inject(OpticalFiberNetworkFindOneHandler);

    dispatch(
        query: OpticalFiberNetworkFindOneQuery,
        options?: FetchOptions
    ): Observable<OpticalFiberNetworkFindOneEntity> {
        return this.handler.execute(query, options);
    }
}
