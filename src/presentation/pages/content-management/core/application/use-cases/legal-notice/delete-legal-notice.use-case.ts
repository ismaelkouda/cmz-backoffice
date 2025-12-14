import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { LegalNoticeRepository } from '../../../domain/repositories/legal-notice.repository';

@Injectable({
    providedIn: 'root',
})
export class DeleteLegalNoticeUseCase {
    constructor(private readonly repository: LegalNoticeRepository) { }

    execute(id: string): Observable<SimpleResponseDto<void>> {
        return this.repository.deleteLegalNotice(id);
    }
}
