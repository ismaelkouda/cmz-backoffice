import { TermsUseEntity } from '@presentation/pages/content-management/core/domain/entities/terms-use.entity';
import { TermsUseFilter } from '@presentation/pages/content-management/core/domain/value-objects/terms-use-filter.vo';
import { Paginate, SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { GetTermsUseByIdEntity } from '../entities/get-terms-use-by-id.entity';

export abstract class TermsUseRepository {
    abstract fetchTermsUse(
        filter: TermsUseFilter,
        page: string
    ): Observable<Paginate<TermsUseEntity>>;
    abstract getTermsUseById(id: string): Observable<GetTermsUseByIdEntity>;
    abstract createTermsUse(params: FormData): Observable<SimpleResponseDto<void>>;
    abstract updateTermsUse(id: string, params: FormData): Observable<SimpleResponseDto<void>>;
    abstract deleteTermsUse(id: string): Observable<SimpleResponseDto<void>>;
    abstract publishTermsUse(id: string): Observable<SimpleResponseDto<void>>;
    abstract unpublishTermsUse(id: string): Observable<SimpleResponseDto<void>>;
}
