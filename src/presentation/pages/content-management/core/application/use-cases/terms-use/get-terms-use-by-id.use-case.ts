import { Injectable } from '@angular/core';
import { TermsUseRepository } from '@presentation/pages/content-management/core/domain/repositories/terms-use.repository';
import { Observable } from 'rxjs';
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
