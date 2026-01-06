import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
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
