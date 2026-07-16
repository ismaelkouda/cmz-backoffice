import { inject, Injectable } from '@angular/core';
import { InfrastructureTypeSelectEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-select.entity';
import { InfrastructureTypeSelectRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure-type/infrastructure-type-select.repository';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureTypeSelectUseCase {
    private readonly repository = inject(InfrastructureTypeSelectRepository);

    readAll(
        options?: FetchOptions
    ): Observable<InfrastructureTypeSelectEntity[]> {
        return defer(() => this.repository.readAll(options));
    }
}
