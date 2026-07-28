import { inject, Injectable } from '@angular/core';
import { OpticalFiberNetworkEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network.entity';
import { OpticalFiberNetworkCreateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-create.contract';
import { OpticalFiberNetworkUpdateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-update.contract';
import { OpticalFiberNetworkRepository } from '@pages/coverage-areas/domain/repositories/optical-fiber-network/optical-fiber-network.repository';
import { opticalFiberNetworkCreateVo } from '@pages/coverage-areas/domain/value-objects/optical-fiber-network/optical-fiber-network-create.vo';
import { opticalFiberNetworkDeleteVo } from '@pages/coverage-areas/domain/value-objects/optical-fiber-network/optical-fiber-network-delete.vo';
import { opticalFiberNetworkDisableVo } from '@pages/coverage-areas/domain/value-objects/optical-fiber-network/optical-fiber-network-disable.vo';
import { opticalFiberNetworkEnableVo } from '@pages/coverage-areas/domain/value-objects/optical-fiber-network/optical-fiber-network-enable.vo';
import { opticalFiberNetworkFilterVo } from '@pages/coverage-areas/domain/value-objects/optical-fiber-network/optical-fiber-network-filter.vo';
import { opticalFiberNetworkUpdateVo } from '@pages/coverage-areas/domain/value-objects/optical-fiber-network/optical-fiber-network-update.vo';
import { OpticalFiberNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-filter.contract';
import {
    Paginate,
    MessageResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';
import { OpticalFiberNetworkDeleteContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-delete.contract';
import { OpticalFiberNetworkEnableContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-enable.contract';
import { OpticalFiberNetworkDisableContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-disable.contract';
import { opticalFiberNetworkFilterEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network-filter.entity';

@Injectable({
    providedIn: 'root',
})
export class OpticalFiberNetworkUseCase {
    private readonly repository = inject(OpticalFiberNetworkRepository);

    execute(
        contract: OpticalFiberNetworkFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<OpticalFiberNetworkEntity>> {
        return defer(() => {
            const vo = opticalFiberNetworkFilterVo(contract);
            const entity = opticalFiberNetworkFilterEntity(vo);
            return this.repository.readAll(entity, page, options);
        });
    }

    create(
        contract: OpticalFiberNetworkCreateContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.create(opticalFiberNetworkCreateVo(contract))
        );
    }

    update(
        contract: OpticalFiberNetworkUpdateContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.update(opticalFiberNetworkUpdateVo(contract))
        );
    }

    delete(
        contract: OpticalFiberNetworkDeleteContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.delete(opticalFiberNetworkDeleteVo(contract))
        );
    }

    enable(
        contract: OpticalFiberNetworkEnableContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.enable(opticalFiberNetworkEnableVo(contract))
        );
    }

    disable(
        contract: OpticalFiberNetworkDisableContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.disable(opticalFiberNetworkDisableVo(contract))
        );
    }
}
