import { Injectable } from '@angular/core';
import { InfrastructureTypeCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-create.validate-contract';
import { InfrastructureTypeUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-update.validate-contract';
import { InfrastructureTypeEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type.entity';
import {
    Paginate,
    MessageResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { InfrastructureTypeDisableValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-disable.validate-contract';
import { InfrastructureTypeEnableValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-enable.validate-contract';
import { InfrastructureTypeDeleteValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-delete.validate-contract';
import { InfrastructureTypeFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-filter.contract';

@Injectable({
    providedIn: 'root',
})
export abstract class InfrastructureTypeRepository {
    abstract readAll(
        dto: InfrastructureTypeFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureTypeEntity>>;
    abstract create(
        contract: InfrastructureTypeCreateValidateContract
    ): Observable<MessageResponseDto>;
    abstract update(
        contract: InfrastructureTypeUpdateValidateContract
    ): Observable<MessageResponseDto>;
    abstract delete(
        dto: InfrastructureTypeDeleteValidateContract
    ): Observable<MessageResponseDto>;
    abstract enable(
        dto: InfrastructureTypeEnableValidateContract
    ): Observable<MessageResponseDto>;
    abstract disable(
        dto: InfrastructureTypeDisableValidateContract
    ): Observable<MessageResponseDto>;
}
