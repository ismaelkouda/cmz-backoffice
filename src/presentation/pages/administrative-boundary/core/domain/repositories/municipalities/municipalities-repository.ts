import { MunicipalitiesEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-filter.vo';
import { Paginate, SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { MunicipalitiesCreate } from '../../value-objects/municipalities/municipalities-create.vo';
import { MunicipalitiesUpdate } from '../../value-objects/municipalities/municipalities-update.vo';

export abstract class MunicipalitiesRepository {
    abstract readAll(
        filter: MunicipalitiesFilter | null,
        page: string
    ): Observable<Paginate<MunicipalitiesEntity>>;
    abstract create(payload: MunicipalitiesCreate): Observable<SimpleResponseDto<void>>;
    abstract update(payload: MunicipalitiesUpdate): Observable<SimpleResponseDto<void>>;
    abstract delete(code: string): Observable<SimpleResponseDto<void>>;
}
