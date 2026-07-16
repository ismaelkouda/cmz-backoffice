import { inject, Injectable } from '@angular/core';
import { InfrastructureTypeCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-create.validate-contract';
import { InfrastructureTypeUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-update.validate-contract';
import { InfrastructureTypeEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type.entity';
import { InfrastructureTypeRepository } from '@pages/administrative-infrastructure/domain/repositories/infrastructure-type/infrastructure-type.repository';
import { infrastructureTypeCreateMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure-type/infrastructure-type-create.mapper';
import { infrastructureTypeDeleteMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure-type/infrastructure-type-delete.mapper';
import { infrastructureTypeDisableMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure-type/infrastructure-type-disable.mapper';
import { infrastructureTypeEnableMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure-type/infrastructure-type-enable.mapper';
import { infrastructureTypeFilterMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure-type/infrastructure-type-filter.mapper';
import { infrastructureTypeUpdateMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure-type/infrastructure-type-update.mapper';
import { InfrastructureTypeMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure-type/infrastructure-type.mapper';
import { InfrastructureTypeApi } from '@pages/administrative-infrastructure/infrastructure/data/sources/infrastructure-type/infrastructure-type.api';
import {
    Paginate,
    MessageResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';
import { InfrastructureTypeFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-filter.contract';
import { InfrastructureTypeDeleteValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-delete.validate-contract';
import { InfrastructureTypeEnableValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-enable.validate-contract';
import { InfrastructureTypeDisableValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-disable.validate-contract';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureTypeRepositoryImpl implements InfrastructureTypeRepository {
    private readonly api = inject(InfrastructureTypeApi);
    private readonly mapper = inject(InfrastructureTypeMapper);

    readAll(
        dto: InfrastructureTypeFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureTypeEntity>> {
        return this.api
            .readAll(infrastructureTypeFilterMapper(dto), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        contract: InfrastructureTypeCreateValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.create(infrastructureTypeCreateMapper(contract));
    }

    update(
        contract: InfrastructureTypeUpdateValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.update(infrastructureTypeUpdateMapper(contract));
    }

    delete(
        contract: InfrastructureTypeDeleteValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.delete(infrastructureTypeDeleteMapper(contract));
    }

    enable(
        contract: InfrastructureTypeEnableValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.enable(infrastructureTypeEnableMapper(contract));
    }

    disable(
        contract: InfrastructureTypeDisableValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.disable(infrastructureTypeDisableMapper(contract));
    }
}
