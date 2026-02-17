import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { LegalNoticeRepository } from '../../../domain/repositories/legal-notice.repository';

@Injectable({
    providedIn: 'root',
})
export class CreateLegalNoticeUseCase {
    constructor(private readonly repository: LegalNoticeRepository) {}

    execute(params: FormData): Observable<SimpleResponseDto<void>> {
        return this.repository.createLegalNotice(params);
    }
}
