import { Injectable, inject } from '@angular/core';
import { mobileNetworkFindOneQueryMapper } from '@pages/coverage-areas/application/queries-mappers/mobile-network/mobile-network-find-one.mapper';
import { MobileNetworkFindOneQuery } from '@pages/coverage-areas/application/queries/mobile-network/mobile-network-find-one.query';
import { MobileNetworkFindOneUseCase } from '@pages/coverage-areas/application/use-cases/mobile-network/mobile-network-find-one.use-case';
import { MobileNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileNetworkFindOneHandler {
    private readonly useCase = inject(MobileNetworkFindOneUseCase);

    execute(
        command: MobileNetworkFindOneQuery,
        options?: FetchOptions
    ): Observable<MobileNetworkFindOneEntity> {
        return this.useCase.execute(
            mobileNetworkFindOneQueryMapper(command),
            options
        );
    }
}
