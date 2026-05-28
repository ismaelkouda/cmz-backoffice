import { Injectable, inject } from '@angular/core';
import { TermsUseQuery } from '@pages/content-management/application/queries/terms-use/terms-use.query';
import { TermsUseHandler } from '@pages/content-management/application/queries-handlers/terms-use/terms-use.handler';
import { TermsUseEntity } from '@pages/content-management/domain/entities/terms-use/terms-use.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUseBus {
    private readonly filterHandler = inject(TermsUseHandler);

    dispatch<T>(query: T, page: string): Observable<Paginate<TermsUseEntity>> {
        if (query instanceof TermsUseQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
