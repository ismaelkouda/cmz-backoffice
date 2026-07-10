import { Injectable, inject } from '@angular/core';
import { InfrastructureQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure/infrastructure.query';
import { InfrastructureHandler } from '@presentation/pages/administrative-infrastructure/application/queries-handlers/infrastructure/infrastructure.handler';
import { InfrastructureEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class InfrastructureBus {
    private readonly filterHandler = inject(InfrastructureHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureEntity>> {
        if (query instanceof InfrastructureQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
