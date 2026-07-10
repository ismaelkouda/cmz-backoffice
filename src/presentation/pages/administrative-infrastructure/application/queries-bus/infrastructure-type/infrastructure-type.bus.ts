import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure-type/infrastructure-type.query';
import { InfrastructureTypeHandler } from '@presentation/pages/administrative-infrastructure/application/queries-handlers/infrastructure-type/infrastructure-type.handler';
import { InfrastructureTypeEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeBus {
    private readonly filterHandler = inject(InfrastructureTypeHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureTypeEntity>> {
        if (query instanceof InfrastructureTypeQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
