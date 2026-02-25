import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TermsUseRepository } from '@presentation/pages/content-management/domain/repositories/terms-use.repository';

import { GetTermsUseByIdEntity } from '../../../domain/entities/get-terms-use-by-id.entity';
@Injectable({
    providedIn: 'root',
})
export class GetTermsUseByIdUseCase {
    constructor(private readonly repository: TermsUseRepository) {}

    execute(id: string): Observable<GetTermsUseByIdEntity> {
        return this.repository.getTermsUseById(id);
    }
}
