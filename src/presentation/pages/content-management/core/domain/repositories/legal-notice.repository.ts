import { Paginate, SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { GetLegalNoticeByIdEntity } from '../entities/get-legal-notice-by-id.entity';
import { LegalNoticeEntity } from '../entities/legal-notice.entity';
import { LegalNoticeFilter } from '../value-objects/legal-notice-filter.vo';

export abstract class LegalNoticeRepository {
    abstract fetchLegalNotice(filter: LegalNoticeFilter, page: string): Observable<Paginate<LegalNoticeEntity>>;
    abstract getLegalNoticeById(id: string): Observable<GetLegalNoticeByIdEntity>;
    abstract createLegalNotice(params: FormData): Observable<SimpleResponseDto<void>>;
    abstract updateLegalNotice(id: string, params: FormData): Observable<SimpleResponseDto<void>>;
    abstract deleteLegalNotice(id: string): Observable<SimpleResponseDto<void>>;
    abstract publishLegalNotice(id: string): Observable<SimpleResponseDto<void>>;
    abstract unpublishLegalNotice(id: string): Observable<SimpleResponseDto<void>>;
}
