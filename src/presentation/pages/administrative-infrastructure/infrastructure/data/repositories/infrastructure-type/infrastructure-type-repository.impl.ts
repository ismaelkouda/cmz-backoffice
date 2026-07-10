import { inject, Injectable } from '@angular/core';
import { InfrastructureTypeCreateEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-create.entity';
import { InfrastructureTypeDeleteEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-delete.entity';
import { InfrastructureTypeDisableEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-disable.entity';
import { InfrastructureTypeEnableEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-enable.entity';
import { InfrastructureTypeFilterEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-filter.entity';
import { InfrastructureTypeUpdateEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-update.entity';
import { InfrastructureTypeEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type.entity';
import { InfrastructureTypeRepository } from '@pages/administrative-infrastructure/domain/repositories/infrastructure-type/infrastructure-type-repository';
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
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureTypeRepositoryImpl implements InfrastructureTypeRepository {
    private readonly api = inject(InfrastructureTypeApi);
    private readonly mapper = inject(InfrastructureTypeMapper);

    readAll(
        entity: InfrastructureTypeFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureTypeEntity>> {
        return this.api
            .readAll(infrastructureTypeFilterMapper(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        entity: InfrastructureTypeCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(infrastructureTypeCreateMapper(entity));
    }

    update(
        entity: InfrastructureTypeUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(infrastructureTypeUpdateMapper(entity));
    }

    delete(
        entity: InfrastructureTypeDeleteEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.delete(infrastructureTypeDeleteMapper(entity));
    }

    enable(
        entity: InfrastructureTypeEnableEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.enable(infrastructureTypeEnableMapper(entity));
    }

    disable(
        entity: InfrastructureTypeDisableEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.disable(infrastructureTypeDisableMapper(entity));
    }
}
