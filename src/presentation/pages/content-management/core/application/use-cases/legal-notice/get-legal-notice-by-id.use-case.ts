import { Injectable } from '@angular/core';
import { GetLegalNoticeByIdEntity } from '@presentation/pages/content-management/core/domain/entities/get-legal-notice-by-id.entity';
import { LegalNoticeRepository } from '@presentation/pages/content-management/core/domain/repositories/legal-notice.repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GetLegalNoticeByIdUseCase {
    constructor(private readonly repository: LegalNoticeRepository) {}

    execute(id: string): Observable<GetLegalNoticeByIdEntity> {
        return this.repository.getLegalNoticeById(id);
    }
}
