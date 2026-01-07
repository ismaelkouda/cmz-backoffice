import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { LegalNoticeEntity } from '../../../domain/entities/legal-notice.entity';
import { LegalNoticeRepository } from '../../../domain/repositories/legal-notice.repository';
import { LegalNoticeFilter } from '../../../domain/value-objects/legal-notice-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchLegalNoticeUseCase {
    private readonly legalNoticeRepository = inject(LegalNoticeRepository);

    execute(
        filter: LegalNoticeFilter,
        page: string
    ): Observable<Paginate<LegalNoticeEntity>> {
        return this.legalNoticeRepository.fetchLegalNotice(filter, page);
    }
}
