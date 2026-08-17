import { Injectable } from '@angular/core';
import { InfrastructureCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.validate-contract';
import { InfrastructureUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.validate-contract';
import { InfrastructureEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { InfrastructureFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-filter.contract';
import { InfrastructureDeleteValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-delete.validate-contract';

@Injectable({
    providedIn: 'root',
})
export abstract class InfrastructureRepository {
    abstract execute(
        validContract: InfrastructureFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureEntity>>;
    abstract create(
        validContract: InfrastructureCreateValidateContract
    ): Observable<MessageResponseDto>;
    abstract update(
        validContract: InfrastructureUpdateValidateContract
    ): Observable<MessageResponseDto>;
    abstract delete(
        validContract: InfrastructureDeleteValidateContract
    ): Observable<MessageResponseDto>;
}
