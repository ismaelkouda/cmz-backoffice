import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { LegalNoticeRepository } from '../../../domain/repositories/legal-notice.repository';

@Injectable({
    providedIn: 'root',
})
export class PublishLegalNoticeUseCase {
    constructor(private readonly repository: LegalNoticeRepository) {}

    execute(id: string): Observable<SimpleResponseDto<void>> {
        return this.repository.publishLegalNotice(id);
    }
}
