import { Injectable, inject } from '@angular/core';
import { InfrastructureFindOneQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure/infrastructure-find-one.query';
import { InfrastructureFindOneHandler } from '@presentation/pages/administrative-infrastructure/application/queries-handlers/infrastructure/infrastructure-find-one.handler';
import { InfrastructureFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class InfrastructureFindOneBus {
    private readonly filterHandler = inject(InfrastructureFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<InfrastructureFindOneEntity> {
        if (query instanceof InfrastructureFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
