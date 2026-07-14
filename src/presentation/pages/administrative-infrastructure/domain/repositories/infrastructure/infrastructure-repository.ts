import { Injectable } from '@angular/core';
import { InfrastructureCreateEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-create.entity';
import { InfrastructureDeleteEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-delete.entity';
import { InfrastructureUpdateEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-update.entity';
import { InfrastructureEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import {
    MessageResponseDto,
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { InfrastructureFilterContract } from '../../contracts/infrastructure/infrastructure-filter.contract';

@Injectable({
    providedIn: 'root',
})
export abstract class InfrastructureRepository {
    abstract execute(
        contract: InfrastructureFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureEntity>>;
    abstract create(
        dto: InfrastructureCreateEntity
    ): Observable<MessageResponseDto>;
    abstract update(
        dto: InfrastructureUpdateEntity
    ): Observable<MessageResponseDto>;
    abstract delete(
        entity: InfrastructureDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
}
