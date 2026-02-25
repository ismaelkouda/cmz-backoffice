import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesCreateEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-create.entity';
import { MunicipalitiesDeleteEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-delete.entity';
import { MunicipalitiesFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-filter.entity';
import { MunicipalitiesUpdateEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-update.entity';
import { MunicipalitiesEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';

export abstract class MunicipalitiesRepository {
    abstract execute(
        entity: MunicipalitiesFilterEntity | null,
        page: string
    ): Observable<Paginate<MunicipalitiesEntity>>;
    abstract create(
        entity: MunicipalitiesCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: MunicipalitiesUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: MunicipalitiesDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
}
