import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { TermsUseEntity } from '@presentation/pages/content-management/domain/entities/terms-use.entity';
import { TermsUseFilter } from '@presentation/pages/content-management/domain/value-objects/terms-use-filter.vo';

import { GetTermsUseByIdEntity } from '../entities/get-terms-use-by-id.entity';

export abstract class TermsUseRepository {
    abstract fetchTermsUse(
        filter: TermsUseFilter | null,
        page: string
    ): Observable<Paginate<TermsUseEntity>>;
    abstract getTermsUseById(id: string): Observable<GetTermsUseByIdEntity>;
    abstract createTermsUse(
        params: FormData
    ): Observable<SimpleResponseDto<void>>;
    abstract updateTermsUse(
        id: string,
        params: FormData
    ): Observable<SimpleResponseDto<void>>;
    abstract deleteTermsUse(id: string): Observable<SimpleResponseDto<void>>;
    abstract publishTermsUse(id: string): Observable<SimpleResponseDto<void>>;
    abstract unpublishTermsUse(id: string): Observable<SimpleResponseDto<void>>;
}
