import { inject, Injectable } from '@angular/core';
import { InfrastructureCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.validate-contract';
import { InfrastructureUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.validate-contract';
import { InfrastructureEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import { InfrastructureRepository } from '@pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure.repository';
import { infrastructureCreateMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure-create.mapper';
import { infrastructureDeleteMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure-delete.mapper';
import { infrastructureFilterMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure-filter.mapper';
import { infrastructureUpdateMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure-update.mapper';
import { InfrastructureMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure.mapper';
import { InfrastructureApi } from '@pages/administrative-infrastructure/infrastructure/data/sources/infrastructure/infrastructure.api';
import { InfrastructureFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-filter.contract';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';
import { InfrastructureDeleteValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-delete.validate-contract';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureRepositoryImpl implements InfrastructureRepository {
    private readonly api = inject(InfrastructureApi);
    private readonly mapper = inject(InfrastructureMapper);

    execute(
        validContract: InfrastructureFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureEntity>> {
        return this.api
            .readAll(infrastructureFilterMapper(validContract), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        validContract: InfrastructureCreateValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.create(infrastructureCreateMapper(validContract));
    }

    update(
        validContract: InfrastructureUpdateValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.update(infrastructureUpdateMapper(validContract));
    }

    delete(
        validContract: InfrastructureDeleteValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.delete(infrastructureDeleteMapper(validContract));
    }
}
