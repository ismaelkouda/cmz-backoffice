import { Injectable } from '@angular/core';
import { InfrastructureCreateEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-create.entity';
import { InfrastructureDeleteEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-delete.entity';
import { InfrastructureFilterEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-filter.entity';
import { InfrastructureUpdateEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-update.entity';
import { InfrastructureEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class InfrastructureRepository {
    abstract readAll(
        entity: InfrastructureFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureEntity>>;
    abstract create(
        entity: InfrastructureCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: InfrastructureUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: InfrastructureDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
}
