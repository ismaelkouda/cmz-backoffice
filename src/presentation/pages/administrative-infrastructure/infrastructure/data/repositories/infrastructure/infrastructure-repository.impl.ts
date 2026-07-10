import { inject, Injectable } from '@angular/core';
import { InfrastructureCreateEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-create.entity';
import { InfrastructureDeleteEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-delete.entity';
import { InfrastructureFilterEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-filter.entity';
import { InfrastructureUpdateEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-update.entity';
import { InfrastructureEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import { InfrastructureRepository } from '@pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure-repository';
import { infrastructureCreateMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure-create.mapper';
import { infrastructureDeleteMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure-delete.mapper';
import { infrastructureFilterMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure-filter.mapper';
import { infrastructureUpdateMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure-update.mapper';
import { InfrastructureMapper } from '@pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure.mapper';
import { InfrastructureApi } from '@pages/administrative-infrastructure/infrastructure/data/sources/infrastructure/infrastructure.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureRepositoryImpl implements InfrastructureRepository {
    private readonly api = inject(InfrastructureApi);
    private readonly mapper = inject(InfrastructureMapper);

    readAll(
        entity: InfrastructureFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureEntity>> {
        return this.api
            .readAll(infrastructureFilterMapper(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        entity: InfrastructureCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(infrastructureCreateMapper(entity));
    }

    update(
        entity: InfrastructureUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(infrastructureUpdateMapper(entity));
    }

    delete(
        entity: InfrastructureDeleteEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.delete(infrastructureDeleteMapper(entity));
    }
}
