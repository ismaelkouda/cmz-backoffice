import { MunicipalitiesCreateEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-create.entity';
import { MunicipalitiesDeleteEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-delete.entity';
import { MunicipalitiesFilterEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-filter.entity';
import { MunicipalitiesUpdateEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-update.entity';
import { MunicipalitiesEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class MunicipalitiesRepository {
    abstract execute(
        entity: MunicipalitiesFilterEntity | null,
        page: string,
        options?: FetchOptions
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
