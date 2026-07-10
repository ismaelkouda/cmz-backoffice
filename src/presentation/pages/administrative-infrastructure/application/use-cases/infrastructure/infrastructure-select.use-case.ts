import { inject, Injectable } from '@angular/core';
import { InfrastructureSelectEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-select.entity';
import { InfrastructureSelectRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure-select-repository';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureSelectUseCase {
    private readonly repository = inject(InfrastructureSelectRepository);

    readAll(options?: FetchOptions): Observable<InfrastructureSelectEntity[]> {
        return this.repository.readAll(options);
    }
}
