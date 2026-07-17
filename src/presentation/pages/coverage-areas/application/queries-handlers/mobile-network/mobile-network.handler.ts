import { Injectable, inject } from '@angular/core';
import { mobileNetworkQueryMapper } from '@pages/coverage-areas/application/queries-mappers/mobile-network/mobile-network.mapper';
import { MobileNetworkQuery } from '@pages/coverage-areas/application/queries/mobile-network/mobile-network.query';
import { MobileNetworkUseCase } from '@pages/coverage-areas/application/use-cases/mobile-network/mobile-network.use-case';
import { MobileNetworkEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileNetworkHandler {
    private readonly useCase = inject(MobileNetworkUseCase);

    execute(
        command: MobileNetworkQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MobileNetworkEntity>> {
        return this.useCase.execute(
            mobileNetworkQueryMapper(command),
            page,
            options
        );
    }
}
