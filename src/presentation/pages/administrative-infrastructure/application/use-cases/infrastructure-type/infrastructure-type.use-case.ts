import { inject, Injectable } from '@angular/core';
import { InfrastructureTypeEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type.entity';
import { InfrastructureTypeCreateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-create.contract';
import { InfrastructureTypeUpdateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-update.contract';
import { InfrastructureTypeRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure-type/infrastructure-type.repository';
import { infrastructureTypeCreateVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-create.vo';
import { infrastructureTypeDeleteVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-delete.vo';
import { infrastructureTypeDisableVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-disable.vo';
import { infrastructureTypeEnableVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-enable.vo';
import { infrastructureTypeFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-filter.vo';
import { infrastructureTypeUpdateVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-update.vo';
import { InfrastructureTypeFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-filter.contract';
import {
    Paginate,
    MessageResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';
import { InfrastructureTypeDeleteContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-delete.contract';
import { InfrastructureTypeEnableContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-enable.contract';
import { InfrastructureTypeDisableContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-disable.contract';
import { infrastructureTypeFilterEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-filter.entity';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureTypeUseCase {
    private readonly repository = inject(InfrastructureTypeRepository);

    execute(
        contract: InfrastructureTypeFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureTypeEntity>> {
        return defer(() => {
            const vo = infrastructureTypeFilterVo(contract);
            const entity = infrastructureTypeFilterEntity(vo);
            return this.repository.readAll(entity, page, options);
        });
    }

    create(
        contract: InfrastructureTypeCreateContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.create(infrastructureTypeCreateVo(contract))
        );
    }

    update(
        contract: InfrastructureTypeUpdateContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.update(infrastructureTypeUpdateVo(contract))
        );
    }

    delete(
        contract: InfrastructureTypeDeleteContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.delete(infrastructureTypeDeleteVo(contract))
        );
    }

    enable(
        contract: InfrastructureTypeEnableContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.enable(infrastructureTypeEnableVo(contract))
        );
    }

    disable(
        contract: InfrastructureTypeDisableContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.disable(infrastructureTypeDisableVo(contract))
        );
    }
}
