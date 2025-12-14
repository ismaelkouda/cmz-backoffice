import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { TermsUseRepository } from '../../../domain/repositories/terms-use.repository';

@Injectable({
    providedIn: 'root',
})
export class UpdateTermsUseUseCase {
    constructor(private readonly repository: TermsUseRepository) { }

    execute(request: { id: string; params: FormData }): Observable<SimpleResponseDto<void>> {
        return this.repository.updateTermsUse(request.id, request.params);
    }
}
