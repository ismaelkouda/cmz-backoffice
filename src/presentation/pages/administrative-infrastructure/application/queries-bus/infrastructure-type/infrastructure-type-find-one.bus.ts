import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeFindOneQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure-type/infrastructure-type-find-one.query';
import { InfrastructureTypeFindOneHandler } from '@presentation/pages/administrative-infrastructure/application/queries-handlers/infrastructure-type/infrastructure-type-find-one.handler';
import { InfrastructureTypeFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeFindOneBus {
    private readonly filterHandler = inject(InfrastructureTypeFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<InfrastructureTypeFindOneEntity> {
        if (query instanceof InfrastructureTypeFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
