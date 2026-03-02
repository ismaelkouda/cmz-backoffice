import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TermsUseQuery } from '@presentation/pages/content-management/application/queries/terms-use/terms-use.query';
import { TermsUseHandler } from '@presentation/pages/content-management/application/queries-handlers/terms-use/terms-use.handler';
import { TermsUseEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use.entity';

@Injectable({ providedIn: 'root' })
export class TermsUseBus {
    constructor(private readonly filterHandler: TermsUseHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<TermsUseEntity>> {
        if (query instanceof TermsUseQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
