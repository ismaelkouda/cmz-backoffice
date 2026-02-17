import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { LegalNoticeRepository } from '../../../domain/repositories/legal-notice.repository';

@Injectable({
    providedIn: 'root',
})
export class UpdateLegalNoticeUseCase {
    constructor(private readonly repository: LegalNoticeRepository) {}

    execute(request: {
        id: string;
        params: FormData;
    }): Observable<SimpleResponseDto<void>> {
        return this.repository.updateLegalNotice(request.id, request.params);
    }
}
