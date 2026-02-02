import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

import { TermsUseRepository } from '../../../domain/repositories/terms-use.repository';

@Injectable({
    providedIn: 'root',
})
export class CreateTermsUseUseCase {
    constructor(private readonly repository: TermsUseRepository) {}

    execute(params: FormData): Observable<SimpleResponseDto<void>> {
        return this.repository.createTermsUse(params);
    }
}
