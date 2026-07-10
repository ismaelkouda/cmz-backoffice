import { Injectable } from '@angular/core';
import { InfrastructureTypeCreateEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-create.entity';
import { InfrastructureTypeDeleteEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-delete.entity';
import { InfrastructureTypeDisableEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-disable.entity';
import { InfrastructureTypeEnableEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-enable.entity';
import { InfrastructureTypeFilterEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-filter.entity';
import { InfrastructureTypeUpdateEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-update.entity';
import { InfrastructureTypeEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class InfrastructureTypeRepository {
    abstract readAll(
        entity: InfrastructureTypeFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureTypeEntity>>;
    abstract create(
        entity: InfrastructureTypeCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: InfrastructureTypeUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: InfrastructureTypeDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract enable(
        entity: InfrastructureTypeEnableEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(
        entity: InfrastructureTypeDisableEntity
    ): Observable<SimpleResponseDto<void>>;
}
