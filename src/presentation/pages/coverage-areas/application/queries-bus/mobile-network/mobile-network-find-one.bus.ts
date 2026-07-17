import { Injectable, inject } from '@angular/core';
import { MobileNetworkFindOneQuery } from '@pages/coverage-areas/application/queries/mobile-network/mobile-network-find-one.query';
import { MobileNetworkFindOneHandler } from '@pages/coverage-areas/application/queries-handlers/mobile-network/mobile-network-find-one.handler';
import { MobileNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class MobileNetworkFindOneBus {
    private readonly filterHandler = inject(MobileNetworkFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<MobileNetworkFindOneEntity> {
        if (query instanceof MobileNetworkFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
