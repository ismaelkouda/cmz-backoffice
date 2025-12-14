import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { TermsUseRepository } from '../../../domain/repositories/terms-use.repository';

@Injectable({
    providedIn: 'root',
})
export class DeleteTermsUseUseCase {
    constructor(private readonly repository: TermsUseRepository) { }

    execute(id: string): Observable<SimpleResponseDto<void>> {
        return this.repository.deleteTermsUse(id);
    }
}
