import { inject } from '@angular/core';
import { ResponsibilitiesSelectEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/responsibilities-select.entity';
import { ResponsibilitiesSelectRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure-type/responsibilities-select-repository';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export class ResponsibilitiesSelectUseCase {
    private readonly repository = inject(ResponsibilitiesSelectRepository);

    readAll(
        options?: FetchOptions
    ): Observable<ResponsibilitiesSelectEntity[]> {
        return this.repository.readAll(options);
    }
}
