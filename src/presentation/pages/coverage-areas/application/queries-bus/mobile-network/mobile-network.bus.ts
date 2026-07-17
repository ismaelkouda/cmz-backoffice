import { Injectable, inject } from '@angular/core';
import { MobileNetworkQuery } from '@pages/coverage-areas/application/queries/mobile-network/mobile-network.query';
import { MobileNetworkHandler } from '@pages/coverage-areas/application/queries-handlers/mobile-network/mobile-network.handler';
import { MobileNetworkEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class MobileNetworkBus {
    private readonly filterHandler = inject(MobileNetworkHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MobileNetworkEntity>> {
        if (query instanceof MobileNetworkQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
