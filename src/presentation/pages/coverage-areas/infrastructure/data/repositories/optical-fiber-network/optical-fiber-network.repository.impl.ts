import { inject, Injectable } from '@angular/core';
import { OpticalFiberNetworkCreateValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-create.validate-contract';
import { OpticalFiberNetworkUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-update.validate-contract';
import { OpticalFiberNetworkEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network.entity';
import { OpticalFiberNetworkRepository } from '@pages/coverage-areas/domain/repositories/optical-fiber-network/optical-fiber-network.repository';
import { opticalFiberNetworkCreateMapper } from '@pages/coverage-areas/infrastructure/data/mappers/optical-fiber-network/optical-fiber-network-create.mapper';
import { opticalFiberNetworkDeleteMapper } from '@pages/coverage-areas/infrastructure/data/mappers/optical-fiber-network/optical-fiber-network-delete.mapper';
import { opticalFiberNetworkDisableMapper } from '@pages/coverage-areas/infrastructure/data/mappers/optical-fiber-network/optical-fiber-network-disable.mapper';
import { opticalFiberNetworkEnableMapper } from '@pages/coverage-areas/infrastructure/data/mappers/optical-fiber-network/optical-fiber-network-enable.mapper';
import { opticalFiberNetworkFilterMapper } from '@pages/coverage-areas/infrastructure/data/mappers/optical-fiber-network/optical-fiber-network-filter.mapper';
import { opticalFiberNetworkUpdateMapper } from '@pages/coverage-areas/infrastructure/data/mappers/optical-fiber-network/optical-fiber-network-update.mapper';
import { OpticalFiberNetworkMapper } from '@pages/coverage-areas/infrastructure/data/mappers/optical-fiber-network/optical-fiber-network.mapper';
import { OpticalFiberNetworkApi } from '@pages/coverage-areas/infrastructure/data/sources/optical-fiber-network/optical-fiber-network.api';
import {
    Paginate,
    MessageResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';
import { OpticalFiberNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-filter.contract';
import { OpticalFiberNetworkDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-delete.validate-contract';
import { OpticalFiberNetworkEnableValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-enable.validate-contract';
import { OpticalFiberNetworkDisableValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-disable.validate-contract';

@Injectable({
    providedIn: 'root',
})
export class OpticalFiberNetworkRepositoryImpl implements OpticalFiberNetworkRepository {
    private readonly api = inject(OpticalFiberNetworkApi);
    private readonly mapper = inject(OpticalFiberNetworkMapper);

    readAll(
        validContract: OpticalFiberNetworkFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<OpticalFiberNetworkEntity>> {
        return this.api
            .readAll(
                opticalFiberNetworkFilterMapper(validContract),
                page,
                options
            )
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        validContract: OpticalFiberNetworkCreateValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.create(opticalFiberNetworkCreateMapper(validContract));
    }

    update(
        validContract: OpticalFiberNetworkUpdateValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.update(opticalFiberNetworkUpdateMapper(validContract));
    }

    delete(
        validContract: OpticalFiberNetworkDeleteValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.delete(opticalFiberNetworkDeleteMapper(validContract));
    }

    enable(
        validContract: OpticalFiberNetworkEnableValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.enable(opticalFiberNetworkEnableMapper(validContract));
    }

    disable(
        validContract: OpticalFiberNetworkDisableValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.disable(
            opticalFiberNetworkDisableMapper(validContract)
        );
    }
}
