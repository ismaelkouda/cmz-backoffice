import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetLegalNoticeByIdEntity } from '@presentation/pages/content-management/domain/entities/get-legal-notice-by-id.entity';
import { LegalNoticeRepository } from '@presentation/pages/content-management/domain/repositories/legal-notice.repository';

@Injectable({
    providedIn: 'root',
})
export class GetLegalNoticeByIdUseCase {
    constructor(private readonly repository: LegalNoticeRepository) {}

    execute(id: string): Observable<GetLegalNoticeByIdEntity> {
        return this.repository.getLegalNoticeById(id);
    }
}
